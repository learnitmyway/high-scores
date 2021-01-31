function SubmitScore({ name, onChange, onSubmit, isSubmitError }) {
  return (
    <section>
      <label>
        {"Name "}
        <input value={name} onChange={onChange} />
      </label>
      <button type="button" onClick={onSubmit}>
        Send it!
      </button>
      <span style={{ color: "red" }}>
        {isSubmitError && " Error: cannot submit score"}
      </span>
    </section>
  );
}

export default SubmitScore;
