window.addEventListener("load", async () => {
    if ("serviceWorker" in navigator) {
        try {
            const data = await navigator.serviceWorker.register("/sw.js");
            console.log("Service worker successfully registered", data);
        } catch (e) {
            console.log("Service worker registration failed!");
        }
    }
    await loadPosts();
});

async function loadPosts() {
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=11"
    );
    const data = await res.json();
    const container = document.querySelector("#posts");
    container.innerHTML = data.map(toCard).join("\n");
}

function toCard(post) {
    return `
        <div class="card">
            <div class="card-title">
                ${post.title}
            </div>
            <div class="card-body">
                ${post.body}
            </div>
        </div>
    `;
}
