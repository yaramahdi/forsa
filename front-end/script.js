document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.getElementById("animated-title");
    const text = "من الرُّكام.. نبني الأحلام";
    const words = text.split(" ");

    titleElement.innerHTML = ""; 

    words.forEach((word, index) => {
        const span = document.createElement("span");
        span.innerText = word;
        span.classList.add("word");
        if (word.includes("الأحلام")) {
            span.classList.add("highlight-word");
        }
        
        titleElement.appendChild(span);
        setTimeout(() => {
            span.classList.add("visible");
        }, index * 400);
    });
    const searchBtn = document.querySelector('.action-btn-green');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', function() {
        const value = searchInput.value.trim();
        if (value) {
            alert("سيتم البحث عن أفضل المحترفين في: " + value);
        } else {
            alert("يرجى إدخال الحرفة التي تبحث عنها أولاً");
        }
    });
});