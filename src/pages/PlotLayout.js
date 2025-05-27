import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../components/Api";
import "../pages/PlotLayout.css";

const PlotLayout = ({ selectedArea, isthirtypercentpaid }) => {
  const [plots, setPlots] = useState([]);
  // const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");

  const [selectedPlot, setSelectedPlot] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const plotDetailsRef = useRef(null);

  useEffect(() => {
    const fetchAreas = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT token not found");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/customer/by-area-group?areaName=${selectedArea}&groupName=FUTURE_GREEN_CITY`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch areas");
        }
        setPlots(data);
        console.log("plots", data);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchAreas();
  }, [selectedArea]);

  const handlePlotSelection = (plot) => {
    setSelectedPlot(plot);

    setTimeout(() => {
      plotDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBooking = () => {
    if (!termsAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Terms & Conditions Required",
        html: "<b>Please accept the terms and conditions to proceed.</b>",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      return;
    }

    // Swal.fire({
    //   icon: "success",
    //   title: "Booking request sent to admin!",
    //   text: "Admin will discuss for more details",
    //   confirmButtonText: "OK",
    // });
  };

  const filteredPlots = plots.filter((plot) => plot.phase === selectedPhase);

  const assignPlotToCustomer = async () => {
    if (!selectedPlot) {
      Swal.fire({
        icon: "warning",
        title: "No Plot Selected!",
        text: "Please select a plot before proceeding.",
        confirmButtonText: "OK",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const storedCustomer = localStorage.getItem("customer");

    if (!token || !storedCustomer) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Customer or token data is missing.",
        confirmButtonText: "OK",
      });
      return;
    }

    const customerData = JSON.parse(storedCustomer);
    const customerId = customerData?.customerId;
    const areaId = selectedPlot?.area.id;
    const plotId = selectedPlot?.id;

    console.log("customerdata", customerData);
    console.log("customerId", customerId);
    console.log("areaId", selectedPlot.area.id);
    console.log("plotId", plotId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/customer/assign-plot`,
        null,
        {
          params: {
            customerId,
            areaId,
            plotId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("asignplot", response.data);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Plot Assigned!",
          text: "The plot has been successfully assigned to you.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Plot Assignment Failed!",
        text: error.response?.data || "Something went wrong.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container">
      <div className="plot_layout">
        <div className="phase-selection">
          <label htmlFor="phase">Select Phase </label>
          <select
            id="phase"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="select">Select Phase</option>
            <option value="Phase_1">Phase 1</option>
            <option value="Phase_2">Phase 2</option>
            <option value="Phase_3">Phase 3</option>
            <option value="Phase_4">Phase 4</option>
          </select>
        </div>

        {/* <div className="plot-grid">
          {filteredPlots.map((plot) => (
            <div
              key={plot.id}
              className="plot"
              onClick={() => handlePlotSelection(plot)}
              style={{
                backgroundColor: plot.active ? "green" : "red",
                color: "white",
                padding: "5px",
                margin: "0px",
                cursor: "pointer",
              }}
            >
              {plot.plotNumber}
            </div>
          ))}
        </div> */}

        <div className="plot-grid">
          {selectedPhase === "" ? (
            <p>Select a phase to view available plots.</p>
          ) : filteredPlots.length > 0 ? (
            filteredPlots.map((plot) => (
              <div
                key={plot.id}
                className="plot"
                onClick={() => handlePlotSelection(plot)}
                style={{
                  position: "relative", // To position the overlay on top of the plot
                  backgroundColor: plot.active ? "white" : "grey", // Change color based on active status
                  color: "black",
                  padding: "5px",
                  margin: "0px",
                  border: plot.active ? "3px solid green" : "2px solid red",
                  cursor: plot.active ? "pointer" : "not-allowed", // Disable click on sold-out plots
                }}
              >
                {plot.plotNumber}
                {!plot.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "rgb(220, 53, 69)",
                      width: "100%",
                      backgroundColor: "rgb(237, 231, 232)",
                    }}
                  >
                    Sold Out
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No plots available for the selected phase.</p>
          )}
        </div>
      </div>

      {selectedPlot && (
        <div ref={plotDetailsRef} className="plot_text">
          <h4>Plot Details</h4>
          <p className="pg_text">Plot Number: {selectedPlot.plotNumber}</p>
          <p className="pg_text">Direction: {selectedPlot.plotDirection}</p>
          <p className="pg_text">Total Price: ₹{selectedPlot.plotAmount}</p>

          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              className="check_box"
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            I agree to the terms and conditions
          </label>

          <button
            onClick={assignPlotToCustomer}
            style={{
              backgroundColor: isthirtypercentpaid ? "green" : "gray",
              color: "white",
            }}
            disabled={!isthirtypercentpaid}
            className="book_now_button"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default PlotLayout;
