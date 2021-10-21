const addCommentFormHandler = async (event) => {
    event.preventDefault();
    console.log("clicked")

    const comment_text = document.querySelector('#content').value.trim();
    
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1];
  
  
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment_text, post_id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to add comment.');

      }
    };
    document.querySelector('#add-comment').addEventListener('click', addCommentFormHandler);