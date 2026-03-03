function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 Project Manager Tracker</h1>
        <p style={styles.subtitle}>
          Welcome Team 👋
        </p>

        <div style={styles.section}>
          <h3>Frontend Team</h3>
          <ul>
            <li>Khushi Sadhu</li>
            <li>Avani Patel</li>
            <li>Dhruhi Shah</li>
            <li>Sankalp</li>
            <li>Mansi</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3>Backend Team</h3>
          <ul>
            <li>Om </li>
            <li>Tai Hadin</li>
            <li>Santosh</li>
          </ul>
        </div>

        <p style={styles.deadline}>
          🎯 Deadline: 15th March
        </p>
        <p style={{ marginTop: "10px", color: "#555", alignItems: "center" }}>
          Let's make it happen! 💪
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "500px",
    textAlign: "center"
  },
  title: {
    marginBottom: "10px"
  },
  subtitle: {
    color: "#555",
    marginBottom: "20px"
  },
  section: {
    textAlign: "left",
    marginTop: "15px"
  },
  deadline: {
    marginTop: "20px",
    fontWeight: "bold",
    color: "#d9534f"
  }
}

export default App