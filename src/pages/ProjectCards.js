import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/ProjectCards.css"; // For custom styles

const ProjectCards = () => {
  const projects = [
    {
      id: 1,
      title: "Future Green City",
      location: "Hyderabad",
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ6owXxdoX0GC4e3e5dMkaY-hyeVOw1bhOyQ&s",
    },
    {
      id: 2,
      title: "Sai Kesava",
      location: "Vijayawada",
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRcyQpRbmJe4uFCdBeeIs0jEfv9NUxFsfayg&s",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {projects.map((project) => (
          <div
            className="col-12 col-sm-6 col-lg-6 mb-4 d-flex justify-content-center"
            key={project.id}
          >
            <div className="card property-card shadow-lg">
              <img
                src={project.imgSrc}
                alt={project.title}
                className="card-img-top img-fluid rounded"
              />
              <div className="card-body text-center">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text text-muted">{project.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <p className="text-success">
          <b>Click on each project above to know more details</b> <span>👆</span>
        </p>
      </div>
    </div>
  );
};

export default ProjectCards;
