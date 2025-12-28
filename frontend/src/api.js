export async function explainCode(code) {
  const response = await fetch("http://127.0.0.1:5000/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to explain code");
  }

  const data = await response.json();
  return data;
}
