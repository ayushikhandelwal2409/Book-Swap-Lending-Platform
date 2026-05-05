import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8085/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('catalog'); // 'catalog', 'dashboard', 'auth', 'profile'
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Dashboard states
  const [myRequests, setMyRequests] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  
  // Book Edit / Add states
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', condition: 'Good' });

  // Catalog Search states
  const [searchQuery, setSearchQuery] = useState('');

  // Profile states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    if (view === 'catalog') {
      if (searchQuery.trim() === '') fetchBooks();
    }
    if (view === 'dashboard' && currentUser) {
      fetchRequests();
      fetchMyBooks();
    }
    if (view === 'profile' && selectedUser) {
      fetchUserRatings(selectedUser.id);
    }
  }, [view, currentUser, selectedUser]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return fetchBooks();
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/books/search?query=${searchQuery}`);
      setBooks(response.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests/owner/${currentUser.id}`);
      setMyRequests(response.data);
    } catch (err) { console.error(err); }
  };

  const fetchMyBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      // filter only my books
      setMyBooks(response.data.filter(b => b.owner?.id === currentUser.id));
    } catch (err) { console.error(err); }
  };

  const fetchUserRatings = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/ratings/user/${userId}`);
      setUserRatings(response.data);
    } catch (err) { console.error(err); }
  };

  const submitAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        const response = await axios.post(`${API_URL}/users/login`, { email, password });
        setCurrentUser(response.data);
        alert(`Welcome back, ${response.data.name}!`);
      } else {
        const response = await axios.post(`${API_URL}/users/register`, { name, email, password });
        setCurrentUser(response.data);
        alert(`Welcome, ${response.data.name}! Your account has been created.`);
      }
      setEmail(''); setPassword(''); setName('');
      setView('catalog');
    } catch (err) {
      alert(authMode === 'login' ? 'Login failed. Invalid credentials.' : 'Registration failed.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView('catalog');
  };

  const requestBorrow = async (bookId) => {
    if (!currentUser) return setView('auth');
    try {
      await axios.post(`${API_URL}/requests/${bookId}/request/${currentUser.id}`);
      alert('Borrow request sent successfully!');
    } catch (err) { alert('Error sending request'); }
  };

  const approveRequest = async (requestId) => {
    try {
      await axios.put(`${API_URL}/requests/${requestId}/approve`);
      alert('Request approved! Book status is now BORROWED.');
      fetchRequests();
      fetchMyBooks();
    } catch (err) { alert('Error approving request'); }
  };

  const saveBook = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`${API_URL}/books/${editingBook.id}`, newBook);
        alert('Book updated!');
        setEditingBook(null);
      } else {
        await axios.post(`${API_URL}/books/${currentUser.id}`, newBook);
        alert('Book added successfully!');
      }
      setNewBook({ title: '', author: '', genre: '', condition: 'Good' });
      fetchMyBooks();
    } catch (err) { alert('Error saving book'); }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to remove this book?")) return;
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      fetchMyBooks();
    } catch (err) { alert('Error removing book'); }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await axios.post(`${API_URL}/ratings/${currentUser.id}/rate/${selectedUser.id}`, {
        score: ratingScore, comment: ratingComment
      });
      alert('Rating submitted!');
      setRatingScore(5); setRatingComment('');
      fetchUserRatings(selectedUser.id);
    } catch (err) { alert('Error submitting rating'); }
  };

  const openProfile = (user) => {
    setSelectedUser(user);
    setView('profile');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" onClick={() => setView('catalog')}>BookSwap</div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => setView('catalog')}>Catalog</button>
          {currentUser && <button className="nav-btn" onClick={() => setView('dashboard')}>Dashboard</button>}
          
          {!currentUser ? (
            <button className="btn-primary" onClick={() => setView('auth')}>Login / Register</button>
          ) : (
            <div className="user-info">
              <span className="welcome-text" onClick={() => openProfile(currentUser)} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                {currentUser.name} (⭐ {currentUser.averageRating || '0.0'})
              </span>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* ---------------- AUTH VIEW ---------------- */}
      {view === 'auth' && (
        <main className="auth-section">
          <div className="auth-card">
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
            <form onSubmit={submitAuth} className="auth-form">
              {authMode === 'register' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
            <p className="auth-switch">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setAuthMode(authMode==='login'?'register':'login')}>
                {authMode === 'login' ? 'Register here' : 'Login here'}
              </span>
            </p>
          </div>
        </main>
      )}

      {/* ---------------- CATALOG VIEW ---------------- */}
      {view === 'catalog' && (
        <>
          <header className="hero-section">
            <h1>Discover & Share Stories</h1>
            <p>Swap, lend, and borrow books with readers in your community.</p>
            <form onSubmit={handleSearch} className="search-bar">
              <input 
                type="text" 
                placeholder="Search by title, author, or genre..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </header>
          <main className="catalog-section" id="catalog">
            <h2>{searchQuery ? 'Search Results' : 'Available Books'}</h2>
            {loading ? <div className="loader">Loading...</div> : (
              <div className="book-grid">
                {books.length > 0 ? books.map(b => (
                  <div key={b.id} className="book-card">
                     <div className="book-cover"><span className="genre-tag">{b.genre}</span></div>
                     <div className="book-info">
                       <h3>{b.title}</h3>
                       <p className="author">by {b.author}</p>
                       <div className="book-meta">
                         <span className="condition">Condition: {b.condition}</span>
                         <span className="owner" onClick={() => openProfile(b.owner)}>
                           Owner: {b.owner?.name} (⭐ {b.owner?.averageRating || '0.0'})
                         </span>
                       </div>
                       {currentUser?.id !== b.owner?.id && (
                         <button className="btn-request" onClick={() => requestBorrow(b.id)}>Request to Borrow</button>
                       )}
                     </div>
                  </div>
                )) : <p className="no-books">No books found. Try a different search.</p>}
              </div>
            )}
          </main>
        </>
      )}

      {/* ---------------- DASHBOARD VIEW ---------------- */}
      {view === 'dashboard' && currentUser && (
        <main className="dashboard-section">
          <h2>My Dashboard</h2>
          
          <div className="dashboard-grid">
            {/* Requests Panel */}
            <div className="panel requests-panel" style={{gridColumn: '1 / -1'}}>
              <h3>Requests for My Books</h3>
              {myRequests.length === 0 ? (
                 <p className="empty-state">You have no pending requests.</p>
              ) : (
                <ul className="request-list">
                  {myRequests.map(req => (
                    <li key={req.id} className="request-item">
                       <div className="request-details">
                         <p className="request-text">
                           <strong onClick={()=>openProfile(req.requester)} className="clickable">{req.requester?.name}</strong> wants to borrow <strong>{req.book?.title}</strong>
                         </p>
                         <span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span>
                       </div>
                       {req.status === 'PENDING' && (
                         <button className="btn-approve" onClick={() => approveRequest(req.id)}>Approve Request</button>
                       )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Edit/Add Book Form */}
            <div className="panel add-book-panel">
              <h3>{editingBook ? 'Edit Book' : 'Publish a New Book'}</h3>
              <form onSubmit={saveBook} className="add-book-form">
                <div className="form-group">
                  <label>Title</label>
                  <input placeholder="e.g. The Hobbit" value={newBook.title} onChange={e=>setNewBook({...newBook, title: e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input placeholder="e.g. J.R.R. Tolkien" value={newBook.author} onChange={e=>setNewBook({...newBook, author: e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input placeholder="e.g. Fantasy" value={newBook.genre} onChange={e=>setNewBook({...newBook, genre: e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select value={newBook.condition} onChange={e=>setNewBook({...newBook, condition: e.target.value})}>
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </div>
                <div style={{display:'flex', gap:'1rem'}}>
                  <button type="submit" className="btn-primary">{editingBook ? 'Update Book' : 'Publish to Catalog'}</button>
                  {editingBook && <button type="button" className="btn-logout" onClick={() => {setEditingBook(null); setNewBook({title:'', author:'', genre:'', condition:'Good'});}}>Cancel</button>}
                </div>
              </form>
            </div>

            {/* My Books List */}
            <div className="panel my-books-panel">
              <h3>My Library</h3>
              {myBooks.length === 0 ? <p className="empty-state">You haven't published any books yet.</p> : (
                <ul className="my-book-list">
                  {myBooks.map(b => (
                    <li key={b.id} className="my-book-item">
                      <div>
                        <strong>{b.title}</strong>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{b.status}</div>
                      </div>
                      <div className="actions">
                        <button className="btn-edit" onClick={() => {setEditingBook(b); setNewBook(b);}}>Edit</button>
                        <button className="btn-delete" onClick={() => deleteBook(b.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ---------------- PROFILE VIEW ---------------- */}
      {view === 'profile' && selectedUser && (
        <main className="profile-section">
          <div className="profile-header">
            <h2>{selectedUser.name}'s Profile</h2>
            <div className="rating-badge">
              <span className="star">⭐</span>
              <span className="score">{selectedUser.averageRating || 'No ratings yet'}</span>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="panel">
              <h3>Ratings & Reviews</h3>
              {userRatings.length === 0 ? <p>No reviews for this user.</p> : (
                <ul className="review-list">
                  {userRatings.map(r => (
                    <li key={r.id} className="review-item">
                      <div className="review-stars">{"⭐".repeat(r.score)}</div>
                      <p className="review-comment">"{r.comment}"</p>
                      <small className="review-author">- {r.rater?.name}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {currentUser && currentUser.id !== selectedUser.id && (
              <div className="panel">
                <h3>Leave a Rating</h3>
                <form onSubmit={submitRating} className="rating-form">
                  <div className="form-group">
                    <label>Score (1-5)</label>
                    <input type="number" min="1" max="5" value={ratingScore} onChange={e=>setRatingScore(Number(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea rows="3" value={ratingComment} onChange={e=>setRatingComment(e.target.value)} required placeholder="How was your swap experience?"></textarea>
                  </div>
                  <button type="submit" className="btn-primary">Submit Rating</button>
                </form>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
