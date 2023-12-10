import React from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../constants/colors.constants";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="card-header" style={{
          backgroundColor: colors[300],
          fontWeight: 600,
          fontSize: 18
        }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body " style={{
          backgroundColor: colors[400],
          minWidth: 250
        }}>
          <p>
            <b>Specialization</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience</b> {doctor.experience}
          </p>
          <p>
            <b>Consultation Fee</b> {doctor.feesPerCunsaltation}
          </p>
          <p>
            <b>Timings</b> {doctor.timings[0]} - {doctor.timings[1]}
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;
