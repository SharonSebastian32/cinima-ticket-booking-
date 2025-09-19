import React, { useMemo } from "react";
import { useState } from "react";

const CininmaHallBooking = ({
  layout = { rows: 8, seatsPerRow: 12, aislePosition: 5 },
  seatTypes = {
    regular: {
      name: "Regular",
      price: 150,
      rows: [0, 1, 2],
    },
    premium: {
      name: "Premium",
      price: 250,
      rows: [3, 4, 5],
    },
    vip: {
      name: "VIP",
      price: 500,
      rows: [6, 7],
    },
  },
  bookedSeats = [],
  cuurency = "INR",
  onBookingComplete = () => {},
  title = "Cininma Hall Booking",
  subTitle = "Select your preferred seats",
}) => {
  const getSeatTypesForRow = () => {};
  const initializedSeats = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatRow = [];
      const seatTypeInfo = getSeatTypesForRow(row);
      for (let seat = 0; seat < layout.seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatRow.push({
          id: seatId,
          row,
          seat,
          type: seatTypeInfo?.type || "regular",
          price: seatTypeInfo?.price || "150",
          color: seatTypeInfo?.color || "blue",
          status: bookedSeats?.includes(seatId) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatRow);
    }
    return seats;
  }, [layout, seatTypes, bookedSeats]);

  const [seats, setSeats] = useState([initializedSeats]);
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 ">
      {/* title */}
      <div className="max-w-6xl  mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
          {title}
        </h1>
        <p className="text-center text-gray-600 mb-6">{subTitle}</p>
        {/* screen */}
        <div className="mb-8">
          <div className="w-full h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 mb-2 shadow-inner rounded-2xl" />
          <p className="text-center text-sm text-gray-500 font-medium ">
            Screen
          </p>
        </div>
        {/* seat map */}
        <div className="mb-6 overflow-x-auto ">
          <div className="flex flex-col items-center min-w-max">
            {seats.map((row, rowIndex) => {
              return (
                <div className="flex items-center mb-2" key={rowIndex}>
                  <span className="w-8 text-center font-bold text-gray-600 mr-4">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* legend */}
        {/* summary */}
        {/* booking button */}
      </div>
    </div>
  );
};

export default CininmaHallBooking;
