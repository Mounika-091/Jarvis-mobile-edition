
const chat = document.getElementById('chat');
const input = document.getElementById('msg');
const send = document.getElementById('send');

// GEMINI API KEY
const API_KEY = "api key";

async function askJarvis() {
    const t = input.value.trim();

    if (!t) return;

    add('YOU: ' + t, 'user');
    input.value = '';

    const loading = add('J.A.R.V.I.S: Processing...', 'ai');

    send.disabled = true;

    try {
        const res = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(API_KEY),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: t
                        }]
                    }],
                    systemInstruction: {
                        parts: [{
                            text: 'You are J.A.R.V.I.S, a helpful AI assistant. Call the user Boss and answer politely.'
                        }]
                    }
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error?.message || 'API Error');
        }

        const answer = data.candidates?.[0]?.content?.parts
            ?.map(p => p.text || '')
            .join('');

        if (!answer) {
            throw new Error('No response received');
        }

        loading.innerText = 'J.A.R.V.I.S: ' + answer;

    } catch (error) {
        loading.innerText = 'J.A.R.V.I.S: ERROR - ' + error.message;
    }

    send.disabled = false;
    chat.scrollTop = chat.scrollHeight;
}

function add(text, who) {
    const d = document.createElement('div');

    d.className = 'msg ' + who;
    d.innerText = text;

    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;

    return d;
}

send.onclick = askJarvis;

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        askJarvis();
    }
});
