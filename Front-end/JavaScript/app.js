import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './App.css';

/*
  Assumptions:
  - Backend is at http://localhost:4000
  - If different, change API_BASE
*/
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

function Header({ onNavigate, darkMode, setDarkMode, mobileOpen, setMobileOpen }) {
  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="logo">SmartGym</div>
      <nav className={`nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#exercises" onClick={(e)=>{e.preventDefault(); onNavigate('exercises')}}>Exercises</a>
        <a href="#nutrition" onClick={(e)=>{e.preventDefault(); onNavigate('nutrition')}}>Nutrition Calculator</a>
        <a href="#chat" onClick={(e)=>{e.preventDefault(); onNavigate('chat')}}>Chat with Trainer</a>
      </nav>
      <div className="header-right">
        <button className="toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className="hamburger" onClick={() => setMobileOpen(s => !s)} aria-label="Menu">☰</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <h1>Welcome to SmartGym</h1>
      <p>Train smarter. Eat better. Chat with expert trainers.</p>
      <div className="features">
        <div className="card">Personalized Nutrition</div>
        <div className="card">Curated Exercises</div>
        <div className="card">Live-like Trainer Chat</div>
      </div>
    </section>
  );
}

function ExerciseCard({ ex, onOpen, favorite, toggleFavorite, startTimer }) {
  return (
    <div className="exercise-card" data-difficulty={ex.difficulty}>
      <div className="card-header">
        <h3>{ex.name}</h3>
        <div className="meta">{ex.category} • {ex.difficulty}</div>
      </div>
      <p className="desc">{ex.description}</p>
      <div className="card-actions">
        <button onClick={() => onOpen(ex)}>Details</button>
        <button onClick={() => { toggleFavorite(ex.id); }} className={favorite ? 'fav active' : 'fav'}>
          {favorite ? '★' : '☆'}
        </button>
        <button onClick={() => startTimer(ex.name)}>⏱ Start Timer</button>
      </div>
    </div>
  );
}

function ExercisesSection({ darkMode }) {
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalEx, setModalEx] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('sg_favs') || '[]'));
  const timerRef = useRef(null);

  useEffect(() => {
    fetchExercises();
    // jQuery: smooth hover animations on load
    $('.exercise-card').hover(function() {
      $(this).toggleClass('hovered');
    });
  }, []);

  useEffect(() => {
    filterList();
  }, [exercises, category, query]);

  useEffect(() => {
    localStorage.setItem('sg_favs', JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(x => x !== id) : [...prev, id];
    });
    // small animation
    $(`.exercise-card[data-id="${id}"]`).fadeOut(100).fadeIn(200);
  }

  async function fetchExercises() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/exercises`);
      setExercises(data.data);
      // small jQuery animation for load
      setTimeout(()=> {
        $('.exercise-card').hide().fadeIn(400);
      }, 50);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  }

  function filterList() {
    let res = [...exercises];
    if (category !== 'all') res = res.filter(e => e.category === category);
    if (query.trim()) res = res.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
    setFiltered(res);
    // jQuery filter animation
    $('.exercise-card').each(function(){
      const $el = $(this);
      const text = $el.find('h3').text().toLowerCase();
      if (query && !text.includes(query.toLowerCase())) {
        $el.slideUp(100);
      } else {
        $el.slideDown(100);
      }
    });
  }

  function openModal(ex) {
    setModalEx(ex);
    // animate modal (jQuery)
    setTimeout(()=> $('#detailModal').fadeIn(200), 50);
  }

  function closeModal() {
    $('#detailModal').fadeOut(150, ()=> setModalEx(null));
  }

  function startTimer(name) {
    // simple 30-sec animation using jQuery
    if (timerRef.current) clearInterval(timerRef.current);
    let sec = 30;
    const modal = $('<div class="timer-popup"></div>').text(`${name}: ${sec}s`);
    $('body').append(modal);
    modal.fadeIn(200);
    timerRef.current = setInterval(()=>{
      sec -= 1;
      modal.text(`${name}: ${sec}s`);
      if (sec <= 0) {
        clearInterval(timerRef.current);
        modal.fadeOut(200, ()=> modal.remove());
      }
    }, 1000);
  }

  return (
    <section id="exercises" className={`section exercises ${darkMode ? 'dark' : ''}`}>
      <h2>Exercises</h2>
      <div className="controls">
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="chest">Chest</option>
          <option value="legs">Legs</option>
          <option value="cardio">Cardio</option>
          <option value="back">Back</option>
        </select>
        <input placeholder="Search exercises..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        <button onClick={()=>{ setQuery(''); setCategory('all'); }}>Reset</button>
      </div>

      {loading && <div className="spinner" />}

      <div className="exercise-grid">
        {filtered.length === 0 && !loading && <div className="empty">No exercises found.</div>}
        {filtered.map(ex => (
          <div className="exercise-card-wrapper" key={ex.id} data-id={ex.id}>
            <ExerciseCard ex={ex} onOpen={openModal} favorite={favorites.includes(ex.id)} toggleFavorite={toggleFavorite} startTimer={startTimer} />
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalEx && (
        <div id="detailModal" className="modal" style={{display:'none'}}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>×</button>
            <h3>{modalEx.name}</h3>
            <p className="meta">{modalEx.category} • {modalEx.difficulty}</p>
            <p>{modalEx.description}</p>
            <pre className="instructions">{modalEx.instructions}</pre>
            {modalEx.video_url && <a href={modalEx.video_url} target="_blank" rel="noreferrer">Watch video</a>}
          </div>
        </div>
      )}
    </section>
  );
}

function NutritionSection({ darkMode }) {
  const [form, setForm] = useState({
    age: '', gender: 'male', weight: '', height: '', activity_level: 'sedentary', goal: 'maintenance'
  });
  const [result, setResult] = useState(() => JSON.parse(localStorage.getItem('sg_nutri') || 'null'));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() => Number(localStorage.getItem('sg_progress') || 0));

  useEffect(() => {
    localStorage.setItem('sg_progress', String(progress));
  }, [progress]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function validate() {
    const { age, weight, height } = form;
    if (!age || !weight || !height) return 'Please fill age, weight and height';
    if (isNaN(Number(age)) || isNaN(Number(weight)) || isNaN(Number(height))) return 'Age/weight/height must be numbers';
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/nutrition/calculate`, form);
      setResult(data.data);
      localStorage.setItem('sg_nutri', JSON.stringify(data.data));
      // update progress increment
      setProgress(p => Math.min(100, p + 10));
    } catch (err) {
      console.error(err);
      alert('Failed to calculate nutrition');
    } finally {
      setLoading(false);
    }
  }

  function printPlan() {
    const printable = document.createElement('div');
    printable.innerHTML = `<h2>Nutrition Plan</h2><pre>${JSON.stringify(result, null, 2)}</pre>`;
    const w = window.open('', '', 'width=600,height=800');
    w.document.write(printable.innerHTML);
    w.document.close();
    w.print();
  }

  return (
    <section id="nutrition" className={`section nutrition ${darkMode ? 'dark' : ''}`}>
      <h2>Nutrition Calculator</h2>
      <div className="nutrition-grid">
        <form className="nutrition-form" onSubmit={onSubmit}>
          <label>Age<input name="age" value={form.age} onChange={handleChange} /></label>
          <label>Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>Weight (kg)<input name="weight" value={form.weight} onChange={handleChange} /></label>
          <label>Height (cm)<input name="height" value={form.height} onChange={handleChange} /></label>
          <label>Activity level
            <select name="activity_level" value={form.activity_level} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </label>
          <label>Goal
            <select name="goal" value={form.goal} onChange={handleChange}>
              <option value="weight_loss">Weight loss</option>
              <option value="muscle_gain">Muscle gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Calculating...' : 'Calculate'}</button>
            <button type="button" onClick={() => { setForm({ age:'', gender:'male', weight:'', height:'', activity_level:'sedentary', goal:'maintenance' }); }}>Reset</button>
          </div>
        </form>

        <div className="nutrition-result">
          {result ? (
            <>
              <div className="result-row"><strong>BMI:</strong> {result.bmi}</div>
              <div className="result-row"><strong>BMR:</strong> {result.bmr} kcal/day</div>
              <div className="result-row"><strong>Target calories:</strong> {result.targetCalories} kcal/day</div>
              <div className="result-row"><strong>Macros:</strong> Protein {result.macros.proteinGrams}g, Carbs {result.macros.carbsGrams}g, Fats {result.macros.fatsGrams}g</div>
              {result.planFromDb && <div className="result-row"><strong>Plan note:</strong> {result.planFromDb.menu_description}</div>}
              {result.planFromDb && <div><h4>Sample meals</h4><ul>{JSON.parse(result.planFromDb.sample_meals).map((m, i)=> <li key={i}><strong>{m.meal}:</strong> {m.items}</li>)}</ul></div>}
              <div className="result-actions">
                <button onClick={printPlan}>Print Plan</button>
                <button onClick={()=>{ navigator.clipboard.writeText(JSON.stringify(result, null, 2)); alert('Copied to clipboard'); }}>Copy JSON</button>
              </div>
            </>
          ) : <div className="empty">No results yet. Fill the form to calculate.</div>}
          <div className="progress">
            <label>Progress toward nutrition goals: {progress}%</label>
            <progress value={progress} max="100" />
            <div className="progress-actions">
              <button onClick={()=>setProgress(p => Math.max(0, p - 10))}>-10%</button>
              <button onClick={()=>setProgress(p => Math.min(100, p + 10))}>+10%</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatSection({ darkMode }) {
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('sg_chat') || '[]'));
  const [userName, setUserName] = useState(() => localStorage.getItem('sg_user') || 'Guest');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    // fetch latest from backend (non-blocking)
    axios.get(`${API_BASE}/api/chat`).then(resp => {
      setMessages(resp.data.data);
      localStorage.setItem('sg_chat', JSON.stringify(resp.data.data));
    }).catch(()=>{ /* ignore */ });
  }, []);

  useEffect(() => {
    localStorage.setItem('sg_chat', JSON.stringify(messages));
    // auto-scroll
    setTimeout(()=> {
      const el = messagesRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    const msg = { user_name: userName, message: input };
    try {
      // send to backend
      const resp = await axios.post(`${API_BASE}/api/chat`, msg);
      setMessages(prev => [...prev, resp.data.data]);
      setInput('');
      // simulate trainer response after 3-5s
      setTimeout(async () => {
        const trainerRespText = `Hi ${userName}, thanks for your question. Here's a tip: focus on consistent training and progressive overload.`;
        try {
          const r2 = await axios.post(`${API_BASE}/api/chat/trainer`, { message: trainerRespText });
          setMessages(prev => [...prev, r2.data.data]);
        } catch (err) {
          // fallback local auto-response if backend fails
          setMessages(prev => [...prev, { id: Date.now(), user_name: 'Trainer', message: trainerRespText, timestamp: new Date().toISOString(), is_trainer: 1 }]);
        }
      }, 3000 + Math.random() * 2000);
    } catch (err) {
      console.error(err);
      // if offline, just append locally
      const fallback = { id: Date.now(), user_name: userName, message: input, timestamp: new Date().toISOString(), is_trainer: 0 };
      setMessages(prev => [...prev, fallback]);
      setInput('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chat" className={`section chat ${darkMode ? 'dark' : ''}`}>
      <h2>Chat with Trainer</h2>
      <div className="chat-box">
        <div className="chat-sidebar">
          <label>Your name<input value={userName} onChange={(e)=>{ setUserName(e.target.value); localStorage.setItem('sg_user', e.target.value); }} /></label>
          <button onClick={()=>{ localStorage.removeItem('sg_chat'); setMessages([]); }}>Clear chat</button>
        </div>
        <div className="chat-main">
          <div className="messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.is_trainer ? 'trainer' : 'user'}`}>
                <div className="meta">{m.user_name} • <span className="time">{new Date(m.timestamp).toLocaleString()}</span></div>
                <div className="text">{m.message}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Write a message..." onKeyDown={(e)=>{ if (e.key === 'Enter') sendMessage(); }} />
            <button onClick={sendMessage} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>Contact: support@smartgym.example</div>
      <div className="socials">
        <a href="#!">Instagram</a> • <a href="#!">YouTube</a> • <a href="#!">Twitter</a>
      </div>
    </footer>
  );
}

// Loading spinner small component
function LoadingOverlay({ show }) {
  return show ? (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  ) : null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('sg_dark') || 'false'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sg_dark', JSON.stringify(darkMode));
    // smooth scrolling for nav (jQuery)
    $('a[href^="#"]').on('click', function(e){
      e.preventDefault();
      const target = $(this).attr('href');
      if ($(target).length) {
        $('html, body').animate({ scrollTop: $(target).offset().top - 60 }, 600);
      }
    });
  }, [darkMode]);

  function navigateTo(section) {
    setMobileOpen(false);
    const el = document.getElementById(section === 'exercises' ? 'exercises' : section);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header onNavigate={navigateTo} darkMode={darkMode} setDarkMode={setDarkMode} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <Hero />
        <ExercisesSection darkMode={darkMode} />
        <NutritionSection darkMode={darkMode} />
        <ChatSection darkMode={darkMode} />
      </main>
      <Footer />
      <LoadingOverlay show={globalLoading} />
    </div>
  );
}