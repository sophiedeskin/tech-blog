async function editFormHandler(event) {
    event.preventDefault();
  
    const post_title = document.querySelector('#title').value.trim();
    const post_text = document.querySelector('#content').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
console.log("clicked")
    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            post_title,
            post_text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.replace('/dashboard/');
      } else {
        alert(response.statusText);
      }
  }
  
  document.querySelector('#edit-post').addEventListener('click', editFormHandler);