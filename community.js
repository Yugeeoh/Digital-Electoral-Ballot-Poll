import { communityPosts, addCommunityPost, currentUser } from "../data/general-data.js";

document.title = 'Community - DEBP';

document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts-container');
  const form = document.getElementById('new-post-form');
  const contentInput = document.getElementById('post-content');

  function renderPosts() {
    if (!postsContainer) return;
    if (!Array.isArray(communityPosts) || communityPosts.length === 0) {
      postsContainer.innerHTML = '<p>No posts yet. Be the first to share!</p>';
      return;
    }
    const html = communityPosts.slice().reverse().map(post => {
      const t = new Date(post.timestamp).toLocaleString();
      return `
        <div class="community-post">
          <strong>${post.username}</strong> <small>${t}</small>
          <p>${post.content}</p>
        </div>
      `;
    }).join('\n');
    postsContainer.innerHTML = html;
  }

  renderPosts();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = contentInput.value.trim();
      if (!text) {
        alert('Please enter some text.');
        return;
      }
      const user = currentUser || 'anonymous';
      addCommunityPost(user, text);
      contentInput.value = '';
      renderPosts();
    });
  }
});
