document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createNewsForm");
    const apiUrl = "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news";
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(form);
      const requestData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        editorFirstName: formData.get("firstname"),
        editorLastName: formData.get("lastname"),
      };
  
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("News created successfully:", data);
          alert("News created successfully!");
          form.reset();
          window.location.href = "index.html"; // Adjust the URL if necessary
        })
        .catch((error) => {
          console.error("Error creating news:", error);
          alert("Error creating news. Please try again.");
        });
    });
  });
  
  function cancelForm() {
    window.location.href = "index.html"; // Adjust the URL if necessary
  }