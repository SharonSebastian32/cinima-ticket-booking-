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
        }}
      />
    </>
  );
}

export default App;
