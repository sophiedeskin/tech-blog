
const deleteClickHandler = async function(event) {
    console.log("clicked")
    // console.log(event.target)
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    const response = await fetch(`api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    
  }
  
    // var cards = document.querySelectorAll('#delete');
    // for (i = 0; i < cards.length; i++){
    //   cards[i].addEventListener('click', deleteClickHandler)
    // }
  var cards = document.querySelectorAll('#delete');
  document.querySelectorAll('#delete')
    for (i = 0; i < cards.length; i++){
      cards[i].addEventListener('click', deleteClickHandler)
    }