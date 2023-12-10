import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { colors } from "../constants/colors.constants";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ============ handle availiblity
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h4 className="text-center link-text p-2">Book an Appointment</h4>
      <div className="container m-2">
        {doctors && (
          <div>
            <div style={{
              backgroundColor: colors[200],
              borderRadius: 5,
              padding: '10px'
            }}>
              <h5 style={{
                color: 'white',
                fontSize: 18,
                // border: `1px solid ${colors[300]}`,
                // borderRadius: '5px',
                padding: '4px'
              }}>
                <span>Appointment with</span> {' '}

                <span>
                  Dr.{doctors.firstName} {doctors.lastName}
                </span>
              </h5>
              <h5 style={{
                color: 'white',
                fontSize: 18,
                // border: `1px solid ${colors[300]}`,
                // borderRadius: '5px',
                padding: '4px'
              }}><span>Fees :</span> {doctors.feesPerCunsaltation}</h5>
              <h5 style={{
                color: 'white',
                fontSize: 18,
                // border: `1px solid ${colors[300]}`,
                // borderRadius: '5px',
                padding: '4px',
                marginBottom: 1
              }}>
                Timings : {doctors.timings && doctors.timings[0]} -{" "}
                {doctors.timings && doctors.timings[1]}{" "}
              </h5>
            </div>
            <div className="d-flex flex-column align-items-center card p-2 mt-3 w-50 m-auto">
              <DatePicker
                aria-required={"true"}
                className="w-100"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                aria-required={"true"}
                format="HH:mm"
                className="m-3 w-100"
                onChange={(value) => {
                  setTime(moment(value).format("HH:mm"));
                }}
              />

              <button
                className="doc-btn mb-3"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button className="doc-btn" style={{
                backgroundColor: colors[300],
                color: 'white'
              }} onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
