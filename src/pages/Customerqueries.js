import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  TextareaAutosize,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AttachFile, Close, Send } from "@mui/icons-material";
import Base from "../components/Base";
import "../pages/Customerqueries.css";
import { API_BASE_URL } from "../components/Api";

export default function CustomerQueries() {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const fetchQueries = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API_BASE_URL}/tickets`);
      const data = await res.json();
      setQueries(data);
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTicketById = async (ticketId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch ticket by ID:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleAssistClick = async (query) => {
    const detailedTicket = await fetchTicketById(query.ticketId);
    if (detailedTicket) {
      const combinedChat = [
        {
          id: `ticket-${detailedTicket.ticketId}`,
          text: detailedTicket.description,
          image: detailedTicket.imageFile,
          sender: detailedTicket.customerName,
          time: detailedTicket.createdAt,
          isCustomer: true,
        },
        ...(detailedTicket.messages?.map((msg) => ({
          id: `msg-${msg.messageId}`,
          text: msg.message,
          image: msg.imageUrl,
          sender: msg.sender,
          time: msg.createdAt,
          isCustomer: true,
        })) || []),
        ...(detailedTicket.responses?.map((res) => ({
          id: `res-${res.responseId}`,
          text: res.responseDescription,
          image: res.responseImage,
          sender: res.admin?.fullName || "Admin",
          time: res.createdAt,
          isCustomer: false,
        })) || []),
      ].sort((a, b) => new Date(a.time) - new Date(b.time));

      setSelectedQuery({
        ...detailedTicket,
        chat: combinedChat,
      });
      setResponse("");
      setImage(null);
      setImageFile(null);
      setOpen(true);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery || (!response.trim() && !imageFile)) return;

    const formData = new FormData();
    if (response.trim()) {
      formData.append("responseDescription", response);
    }
    if (imageFile) {
      formData.append("responseImage", imageFile);
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/tickets/${selectedQuery.ticketId}/responses`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const updatedTicket = await fetchTicketById(selectedQuery.ticketId);
        if (updatedTicket) {
          const combinedChat = [
            {
              id: `ticket-${updatedTicket.ticketId}`,
              text: updatedTicket.description,
              image: updatedTicket.imageFile,
              sender: updatedTicket.customerName,
              time: updatedTicket.createdAt,
              isCustomer: true,
            },
            ...(updatedTicket.messages?.map((msg) => ({
              id: `msg-${msg.messageId}`,
              text: msg.message,
              image: msg.imageUrl,
              sender: msg.sender,
              time: msg.createdAt,
              isCustomer: true,
            })) || []),
            ...(updatedTicket.responses?.map((res) => ({
              id: `res-${res.responseId}`,
              text: res.responseDescription,
              image: res.responseImage,
              sender: res.admin?.fullName || "Admin",
              time: res.createdAt,
              isCustomer: false,
            })) || []),
          ].sort((a, b) => new Date(a.time) - new Date(b.time));

          setSelectedQuery((prev) => ({
            ...prev,
            chat: combinedChat,
          }));
        }
      }

      setResponse("");
      setImage(null);
      setImageFile(null);
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (res.ok) {
        setQueries((prev) =>
          prev.map((q) =>
            q.ticketId === ticketId ? { ...q, status: newStatus } : q
          )
        );

        if (selectedQuery && selectedQuery.ticketId === ticketId) {
          setSelectedQuery((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    fetchQueries(); // Refresh the list when closing the dialog
  };

  return (
    <Base>
      <div className="mt-5 pt-5">
        <h2 className=" mt-5 queries_heading">Customers Support Tickets</h2>
      </div>

      <Card className="table-container-queries">
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Attachment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queries.length > 0 ? (
                queries.map((query, index) => (
                  <TableRow key={query.ticketId} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{query.customerName}</TableCell>
                    <TableCell>
                      {new Date(query.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="description-cell">
                      {query.description.length > 50
                        ? `${query.description.substring(0, 50)}...`
                        : query.description}
                    </TableCell>
                    <TableCell>
                      {query.imageFile ? (
                        <a
                          href={query.imageFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          View Attachment
                        </a>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={query.status}
                        onChange={(e) =>
                          handleStatusChange(query.ticketId, e.target.value)
                        }
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="OPEN">Open</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="RESOLVED">Resolved</MenuItem>
                        <MenuItem value="CLOSED">Closed</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAssistClick(query)}
                        className="assist-button"
                      >
                        View Chat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {refreshing ? <CircularProgress /> : "No tickets found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedQuery && (
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          fullScreen={window.innerWidth < 600}
          PaperProps={{
            style: {
              height: "80vh",
              maxHeight: "800px",
            },
          }}
        >
          <DialogTitle className="dialog-header">
            <div className="dialog-title">
              <span>Ticket #{selectedQuery.ticketId}</span>
              <span className="customer-name">
                {selectedQuery.customerName}
              </span>
            </div>
            <div className="ticket-status-container">
              <Select
                value={selectedQuery.status}
                onChange={(e) =>
                  handleStatusChange(selectedQuery.ticketId, e.target.value)
                }
                size="small"
                sx={{
                  minWidth: 120,
                  backgroundColor:
                    selectedQuery.status === "OPEN"
                      ? "#ffebee"
                      : selectedQuery.status === "IN_PROGRESS"
                      ? "#fff8e1"
                      : selectedQuery.status === "RESOLVED"
                      ? "#e8f5e9"
                      : "#f5f5f5",
                }}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </div>
          </DialogTitle>

          <DialogContent className="dialog-content">
            <div className="chat-container">
              {selectedQuery.chat?.length > 0 ? (
                selectedQuery.chat.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.isCustomer ? "customer" : "admin"
                    }`}
                  >
                    <div className="message-bubble">
                      <div className="message-sender">{message.sender}</div>
                      {message.text && (
                        <div className="message-text">{message.text}</div>
                      )}
                      {message.image && (
                        <div className="message-image">
                          <img
                            src={message.image}
                            alt="Attachment"
                            onClick={() => window.open(message.image, "_blank")}
                          />
                        </div>
                      )}
                      <div className="message-time">
                        {new Date(message.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages yet</div>
              )}
            </div>

            <div className="response-area">
              <div className="response-input">
                <TextareaAutosize
                  placeholder="Type your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  minRows={1}
                  maxRows={4}
                  className="response-textarea"
                />
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span">
                    <AttachFile />
                  </IconButton>
                </label>
              </div>

              {image && (
                <div className="image-preview">
                  <img src={image} alt="Preview" />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </div>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitResponse}
                disabled={loading || (!response.trim() && !imageFile)}
                endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                className="send-button"
              >
                {loading ? "Sending" : "Send"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Base>
  );
}