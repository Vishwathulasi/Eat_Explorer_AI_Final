import "../styles/MessageBox.css";

export default function MessageBox({ message }) {
  if (!message) return null;

  return (
    <div className="message-box">
      {message.split("\n\n").map((block, idx) => (
        <p key={idx}>{block}</p>
      ))}
    </div>
  );
}
