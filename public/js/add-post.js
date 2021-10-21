const addpostFormHandler = async (event) => {
    event.preventDefault();
  
    const post_title = document.querySelector('#title').value.trim();
    const post_text = document.querySelector('#content').value.trim();
  
  
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ post_title, post_text }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard', {
          layout: 'dashboard'
        });
      } else {
        alert('Failed to add post.');

      }
    };
    document.querySelector('#add-post').addEventListener('click', addpostFormHandler);