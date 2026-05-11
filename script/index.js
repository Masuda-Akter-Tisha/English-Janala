const loadLessons = () => {
    fetch ('https://openapi.programming-hero.com/api/levels/all')
    .then (res => res.json ())
    .then (json => displayLessons (json.data))
}

const loadLessonWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch (url)
    .then (res => res.json ())
    .then (data => displayLessonWord (data.data))
}

const displayLessonWord = (words) => {
    const wordContainer = document.getElementById ('word-container');
    wordContainer.innerHTML = '';
    words.forEach (word => {
        console.log(word);
        
        const cardDiv = document.createElement ('div');
        cardDiv.className = 'bg-base-100 rounded-xl py-12 px-8 shadow-sm text-center space-y-6';
        cardDiv.innerHTML = `
          <h2 class="text-3xl font-bold">${word.word}</h2>
          <p class="text-xl font-medium">meaning / pronunciation</p>
          <div class="font-bangla text-3xl font-semibold text-gray-600">"${word.meaning} / ${word.pronunciation}"</div>
          <div class="flex justify-between">
            <button class="btn bg-sky-100 hover:bg-sky-200"><i class="fa-solid fa-circle-info"></i></button>
            <button class="btn bg-sky-100 hover:bg-sky-200"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        `;
        wordContainer.appendChild (cardDiv);
    })
}

const displayLessons = (lessons) => {
      // 1.get level container and empty the container
      const levelContainer = document.getElementById ('level-container');
      levelContainer.innerHTML = '';
    // 2.get into every lesson
      for (let lesson of lessons) {
        // console.log(lesson);
        
        // 3.create element
        const btnDiv = document.createElement ('div');
        btnDiv.innerHTML = `
         <button onclick = "loadLessonWord (${lesson.level_no})" class = 'btn btn-outline btn-primary'>
         <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no} 
         </button>
        `
        // 4.append into container
        levelContainer.appendChild (btnDiv);
    }
}

loadLessons ();