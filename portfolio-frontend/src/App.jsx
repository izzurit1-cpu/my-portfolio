import React, { useState, useEffect } from 'react';

// Умный выбор пути: на компьютере стучимся на порт 5000, на сервере — по относительному пути
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio' 
  : '/api/portfolio';

function App() {
  const [data, setData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editColor, setEditColor] = useState('#6366f1');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setEditName(data.name);
        setEditBio(data.bio);
        setEditColor(data.themeColor);
      }).catch(err => console.error("Ошибка сети:", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = { ...data, name: editName, bio: editBio, themeColor: editColor };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      setData(updatedData);
      alert('Данные успешно сохранены на сервере!');
    }
  };

  if (!data) return <div style={{textAlign: 'center', paddingTop: '50px', color: '#fff'}}>Загрузка системы...</div>;

  return (
    <div style={{ backgroundColor: '#111827', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={() => setIsAdmin(!isAdmin)} style={{ backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          {isAdmin ? "Выйти из панели" : "⚙️ Панель управления"}
        </button>
      </div>

      <main style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <header style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: data.themeColor, fontSize: '3rem', margin: '0 0 16px 0' }}>{data.name}</h1>
          <p style={{ color: '#9ca3af', fontSize: '1.25rem', lineHeight: '1.6' }}>{data.bio}</p>
        </header>

        <section>
          <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '10px', marginBottom: '20px' }}>Проекты</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {data.projects.map(p => (
              <div key={p.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{p.title}</h3>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isAdmin && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1f2937', borderTop: '2px solid #4b5563', padding: '24px', boxShadow: '0 -10px 25px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSave} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#818cf8' }}>🛠️ Настройки кастомизации</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>ИМЯ</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #4b5563', color: '#fff', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>ЦВЕТ АКЦЕНТА</label>
                <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} style={{ width: '60px', height: '38px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>О СЕБЕ</label>
              <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #4b5563', color: '#fff', borderRadius: '4px', resize: 'none' }}></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setIsAdmin(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>Отмена</button>
              <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить изменения</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;