import "./App.css";
import CininmaHallBooking from "./Components/CininmaHallBooking";

function App() {
  return (
    <>
      <CininmaHallBooking
        layout={{ rows: 8, seatsPerRow: 12, aislePosition: 5 }}
        seatTypes={{
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
        }}
        bookedSeats={["C2", "C4"]}
        onBookingComplete={(booking) => console.log(booking)}
      />
    </>
  );
}

export default App;
