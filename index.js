document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news";
    const contentDiv = document.getElementById("content");
  
    function fetchAndDisplayNews() {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const table = createTable(data);
          contentDiv.innerHTML = table;
          attachEventListeners();
        })
        .catch((error) => {
          contentDiv.innerHTML = `<p>Error loading news: ${error.message}</p>`;
        });
    }
  
    function createTable(data) {
      let table = `
              <table class="styled-table">
                  <thead>
                      <tr>
                          <th>Id</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Likes</th>
                          <th>Date Updated</th>
                          <th>Date Created</th>
                          <th>Action</th>
                          <th><button class="create-btn">Create</button></th>
                      </tr>
                  </thead>
                  <tbody>
          `;
  
      data.forEach((news) => {
        table += `
                  <tr data-id="${news.id}">
                      <td>${news.id}</td>
                      <td><span class="field">${news.title}</span><input type="text" class="input-field" value="${news.title}"></td>
                      <td><span class="field">${news.category}</span><input type="text" class="input-field" value="${news.category}"></td>
                      <td><span class="field">${news.likes}</span><input type="text" class="input-field" value="${news.likes}"></td>
                      <td><span class="field">${news.dateUpdated}</span><input type="text" class="input-field" value="${news.dateUpdated}"></td>
                      <td><span class="field">${news.dateCreated}</span><input type="text" class="input-field" value="${news.dateCreated}"></td>
                      <td>
                          <button class="action-btn delete-btn" data-id="${news.id}">Delete</button>
                          <button class="action-btn update-btn" data-id="${news.id}">Update</button>
                      </td>
                  </tr>
              `;
      });
  
      table += `
                  </tbody>
              </table>
          `;
      return table;
    }
  
    function attachEventListeners() {
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const newsId = button.getAttribute("data-id");
          deleteNews(newsId);
        });
      });
  
      document.querySelectorAll(".update-btn").forEach((button) => {
        button.addEventListener("click", () => {
          toggleEdit(button);
        });
      });
  
      const createBtn = document.querySelector(".create-btn");
      createBtn.addEventListener("click", () => {
        window.location.href = "post.html";
      });
    }
  
    function deleteNews(newsId) {
      fetch(`${apiUrl}/${newsId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete news item");
          fetchAndDisplayNews();
        })
        .catch((error) => {
          console.error("Error deleting news item:", error);
        });
    }
  
    function toggleEdit(button) {
      const row = button.closest("tr");
      const fields = row.querySelectorAll(".field");
      const inputFields = row.querySelectorAll(".input-field");
  
      if (button.textContent === "Update") {
        button.textContent = "Save";
        fields.forEach((field) => (field.style.display = "none"));
        inputFields.forEach((input) => (input.style.display = "inline-block"));
      } else {
        button.textContent = "Update";
        const updatedData = getUpdatedData(inputFields);
        const newsId = button.getAttribute("data-id");
        updateNews(newsId, updatedData);
        fields.forEach((field) => (field.style.display = "inline-block"));
        inputFields.forEach((input) => (input.style.display = "none"));
      }
    }
  
    function getUpdatedData(inputFields) {
      return {
        title: inputFields[0].value,
        category: inputFields[1].value,
        likes: inputFields[2].value,
        dateUpdated: inputFields[3].value,
        dateCreated: inputFields[4].value,
      };
    }
  
    function updateNews(newsId, updatedNews) {
      fetch(`${apiUrl}/${newsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNews),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          console.log("Updated news:", data);
          fetchAndDisplayNews();
        })
        .catch((error) => {
          console.error("Error updating news:", error);
        });
    }
  
    const form = document.getElementById("createNewsForm");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const requestData = {
          title: formData.get("title"),
          description: formData.get("description"),
          category: formData.get("category"),
          editorFirstName: formData.get("editorFirstName"),
          editorLastName: formData.get("editorLastName"),
        };
        createNews(requestData);
      });
    }
  
    function createNews(requestData) {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          console.log("News created successfully:", data);
          alert("News created successfully!");
          form.reset();
          window.location.href = "main.html";
        })
        .catch((error) => {
          console.error("Error creating news:", error);
          alert("Error creating news. Please try again.");
        });
    }
  
    fetchAndDisplayNews();
  });