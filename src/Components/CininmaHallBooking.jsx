import React, { useMemo, useState } from "react";

const CininmaHallBooking = ({
  layout = { rows: 8, seatsPerRow: 12, aislePosition: 5 },
  seatTypes = {
    regular: {
      name: "Regular",
      price: 150,
      rows: [0, 1, 2],
      color: "blue",
    },
    premium: {
      name: "Premium",
      price: 250,
      rows: [3, 4, 5],
      color: "purple",
    },
    vip: {
      name: "VIP",
      price: 500,
      rows: [6, 7],
      color: "yellow",
    },
  },
  bookedSeats = [],
  currency = "INR",
  onBookingComplete = () => {},
  title = "Cininma Hall Booking",
  subTitle = "Select your preferred seats",
}) => {
  const colors = [
    "blue",
    "purple",
    "yellow",
    "green",
    "red",
    "indigo",
    "pink",
    "gray",
  ];

  const getColorClass = (colorName) => {
    const colorMap = {
      blue: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
      purple:
        "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200",
      yellow:
        "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
      green: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
      red: "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
      indigo:
        "bg-indigo-100 border-indigo-300 text-indigo-800 hover:bg-indigo-200",
      pink: "bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200",
      gray: "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200",
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const getSeatTypesForRow = (row) => {
    const seatTypeEntries = Object.entries(seatTypes);
    for (let i = 0; i < seatTypeEntries.length; i++) {
      const [type, config] = seatTypeEntries[i];
      if (config.rows.includes(row)) {
        const color = colors[i % colors.length];
        return { type, color, ...config };
      }
    }
    const [firstType, firstConfig] = seatTypeEntries[0];
    return { type: firstType, color: colors[0], ...firstConfig };
  };

  const initializedSeats = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatRow = [];
      const seatTypeInfo = getSeatTypesForRow(row);
      for (let seat = 0; seat < layout.seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatRow.push({
          id: seatId,
          // internal indexes (0-based) for array access:
          rowIndex: row,
          seatIndex: seat,
          // friendly/display numbers (1-based):
          rowNumber: row + 1,
          seatNumber: seat + 1,
          type: seatTypeInfo?.type || "regular",
          price: Number(seatTypeInfo?.price ?? 150),
          color: seatTypeInfo?.color || "blue",
          status: bookedSeats?.includes(seatId) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatRow);
    }
    return seats;
  }, [layout, seatTypes, bookedSeats]);

  const [seats, setSeats] = useState(initializedSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getSeatClassName = (seat) => {
    const baseClass =
      "w-8 h-8 sm:w-10 lg:w-12 lg:h-12 m-1 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-bold";
    if (seat.status === "booked") {
      return `${baseClass} bg-gray-400 border-gray-600 text-gray-100 cursor-not-allowed`; // booked
    }
    if (seat.selected) {
      return `${baseClass} border-green-600 bg-green-500 text-white transform scale-110`;
    }
    return `${baseClass} ${getColorClass(seat.color)}`;
  };

  // updated signature: pass rowIndex explicitly (0-based)
  const renderSeatSelection = (seatRow, rowIndex, startIndex, endIndex) => {
    return (
      <div className="flex items-center">
        {seatRow.slice(startIndex, endIndex).map((seat, index) => {
          const actualSeatIndex = startIndex + index;
          return (
            <div
              key={seat.id}
              className={getSeatClassName(seat)}
              title={`${seat.id} - ${
                getSeatTypesForRow(seat.rowIndex)?.name || "Regular"
              } - ${seat.price} ${currency}`}
              onClick={() => {
                handleSeatClick(rowIndex, actualSeatIndex);
              }}
            >
              {seat.seatNumber}
            </div>
          );
        })}
      </div>
    );
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seat = seats[rowIndex][seatIndex];
    if (!seat || seat.status === "booked") return;

    const isCurrentlySelected = seat.selected;

    // toggle selection in seats grid
    setSeats((prevSeats) =>
      prevSeats.map((row, rIdx) =>
        row.map((s, sIdx) => {
          if (rIdx === rowIndex && sIdx === seatIndex) {
            return { ...s, selected: !s.selected };
          }
          return s;
        })
      )
    );

    // update selectedSeats list (store friendly values)
    setSelectedSeats((prev) => {
      if (isCurrentlySelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        // push a copy with display-friendly fields
        return [
          ...prev,
          {
            id: seat.id,
            row: seat.rowNumber,
            seat: seat.seatNumber,
            price: seat.price,
            type: seat.type,
          },
        ];
      }
    });
  };

  const uniqueSeatTypes = Object.entries(seatTypes).map(
    ([type, config], index) => {
      return {
        type,
        color: colors[index % colors.length],
        ...config,
      };
    }
  );

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + Number(seat.price), 0);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    window.alert("Booking confirmed: " + JSON.stringify(selectedSeats));

    setSeats((prevSeats) => {
      return prevSeats.map((row) =>
        row.map((seat) => {
          if (selectedSeats.some((selected) => selected.id === seat.id)) {
            return { ...seat, status: "booked", selected: false };
          }
          return seat;
        })
      );
    });

    onBookingComplete({
      seats: selectedSeats,
      totalPrice: getTotalPrice(),
      seatIds: selectedSeats.map((seat) => seat.id),
      status: "booked",
    });

    alert(
      `Successfully Booked ${
        selectedSeats.length
      } seat(s) for ${currency} ${getTotalPrice().toFixed(2)}`
    );

    setSelectedSeats([]);
  };

  console.log("selectedSeats", selectedSeats);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 ">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
          {title}
        </h1>
        <p className="text-center text-gray-600 mb-6">{subTitle}</p>

        <div className="mb-8">
          <div className="w-full h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 mb-2 shadow-inner rounded-2xl" />
          <p className="text-center text-sm text-gray-500 font-medium ">
            Screen
          </p>
        </div>

        <div className="mb-6 overflow-x-auto ">
          <div className="flex flex-col items-center min-w-max">
            {seats.map((row, rowIndex) => {
              return (
                <div className="flex items-center mb-2" key={rowIndex}>
                  <span className="w-8 text-center font-bold text-gray-600 mr-4">
                    {String.fromCharCode(65 + rowIndex)} {/* A, B, C... */}
                  </span>
                  {renderSeatSelection(row, rowIndex, 0, layout.aislePosition)}
                  <div className="w-8" />
                  {renderSeatSelection(
                    row,
                    rowIndex,
                    layout.aislePosition,
                    layout.seatsPerRow
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          {uniqueSeatTypes.map((seatType) => {
            return (
              <div className="items-center flex" key={seatType.type}>
                <div
                  className={`w-6 h-6 border-2 rounded-t-lg mr-2 ${getColorClass(
                    seatType.color
                  )}`}
                ></div>
                <span className="text-sm">
                  {seatType.name} {currency} ({seatType.price})
                </span>
              </div>
            );
          })}

          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded-t-lg mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-500 border-2 border-gray-600 rounded-t-lg mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>

        <div className="font-bold text-lg mb-2">Booking Summary</div>

        {selectedSeats.length > 0 ? (
          <div>
            <p className="mb-2">
              Selected Seats:
              <span> {selectedSeats.map((s) => s.id).join(", ")}</span>
            </p>
            <p className="text-xl font-bold text-green-500">
              Total: {getTotalPrice().toFixed(2)} {currency}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No Seat Selected</p>
        )}

        {selectedSeats.length > 0 && (
          <button
            onClick={handleBooking}
            className="w-full py-3 px-6 rounded-lg text-lg font-bold transition-all duration-200 bg-green-500 hover:bg-green-600 text-white mt-4"
          >
            Book Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default CininmaHallBooking;
