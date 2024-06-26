export default function Button({ handleClick, text }) {
  return (
    <div className="Chip-root makeStypes-chipBlue-108 Chip-clickable">
      <span onClick={handleClick} className="form-Chip-label">
        {text}
      </span>
    </div>
  );
}
