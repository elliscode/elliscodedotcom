const commentsDiv = document.getElementById('comments');
async function loadComments(event) {
  let response = await fetch('https://api.blog.elliscode.com/get-comments', {
    method: "POST",
    body: JSON.stringify({
      postId: folder
    })
  });
  if (200 <= response.status && response.status < 300) {
    const data = await response.json();
    renderCommentBox();
    let yourCommentsInThisPost = [];
    try {
      let yourCommentsString = localStorage.getItem('elliscode-comments-you-made');
      let yourComments = JSON.parse(yourCommentsString);
      yourCommentsInThisPost = yourComments.filter(x=>x.postId==folder);
    } catch (e) {
      localStorage.setItem('elliscode-comments-you-made', JSON.stringify([]));
    }
    for (let comment of data) {
      renderComment(comment, yourCommentsInThisPost);
    }
    for (let comment of yourCommentsInThisPost) {
      renderComment(comment);
    }
  } else {
    try {
      const data = await response.json();
      console.log(data);
    } catch {
      console.log("Error displaying comments");
    }
  }
}
function renderCommentBox() {
  {
    const element = document.createElement('h3');
    element.innerText = 'Leave a comment';
    commentsDiv.appendChild(element);
  }

  const div = document.createElement('div');
  div.classList.add('author-comment');
  {
    const element = document.createElement('input');
    element.placeholder = 'Name';
    div.appendChild(element);
  }
  {
    const element = document.createElement('textarea');
    element.placeholder = 'What did you think?';
    div.appendChild(element);
  }
  {
    const element = document.createElement('button');
    element.innerText = 'Submit';
    element.addEventListener('click', submitComment);
    div.appendChild(element);
  }

  commentsDiv.appendChild(div);

  {
    const element = document.createElement('h3');
    element.innerText = 'Comments';
    element.classList.add('comment-header');
    commentsDiv.appendChild(element);
  }
}
function renderComment(comment, yourCommentsInThisPost) {
  const h3 = document.querySelector('h3.comment-header');

  const div = document.createElement('div');
  div.classList.add('comment');

  {
    const element = document.createElement('p');
    element.innerText = comment.name;
    div.appendChild(element);
  }
  {
    const element = document.createElement('p');
    element.innerText = comment.time;
    div.appendChild(element);
  }
  {
    const element = document.createElement('p');
    element.innerText = comment.commentText;
    div.appendChild(element);
  }
  let foundComment = undefined;
  if (yourCommentsInThisPost) {
    foundComment = yourCommentsInThisPost.findIndex(x=>x.name==comment.name&&x.commentText==comment.commentText);
  }
  if (foundComment >= 0) {
    comment.password = yourCommentsInThisPost[foundComment].password;
    yourCommentsInThisPost.splice(foundComment, 1);
  }
  if (comment.password) {
    const element = document.createElement('button');
    element.innerHTML = '&times;';
    element.setAttribute('password', comment.password);
    element.classList.add('close');
    div.appendChild(element);
  }

  commentsDiv.insertBefore(div, h3.nextElementSibling);
}
async function submitComment(event) {
  const nameElement = event.target.parentElement.querySelector('input');
  const textElement = event.target.parentElement.querySelector('textarea');
  const name = nameElement.value;
  const commentText = textElement.value;
  if (!name || !commentText) {
    return;
  }
  let response = await fetch('https://api.blog.elliscode.com/comment', {
    method: "POST",
    body: JSON.stringify({
      postId: folder,
      commentText: commentText,
      name: name
    })
  });
  if (200 <= response.status && response.status < 300) {
    const data = await response.json();
    let yourComment = {
      name: name, 
      commentText: commentText, 
      time: Math.round(Temporal.Now.instant().epochMilliseconds/1000), 
      password: data.password,
      postId: folder
    };
    renderComment(yourComment);
    try {
      let yourCommentsString = localStorage.getItem('elliscode-comments-you-made');
      let yourComments = JSON.parse(yourCommentsString);
      yourComments.push(yourComment);
      localStorage.setItem('elliscode-comments-you-made', JSON.stringify(yourComments));
    } catch (e) {
      localStorage.setItem('elliscode-comments-you-made', JSON.stringify([]));
    }
  } else {
    try {
      const data = await response.json();
      console.log(data);
    } catch {
      console.log("Error displaying comments");
    }
  }
}
