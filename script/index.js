
const createElements = (array) => {
    const htmlElements = array.map (el => {
       return `<span class="bg-[#EDF7FF] border border-[#D7E4EF] rounded-md px-3 py-2 text-sm text-gray-700">${el}</span>`
    })
    return htmlElements.join (" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  const spinner = document.getElementById ('spinner');
  const wordContainer = document.getElementById ('word-container');
  if (status === true) {
    spinner.classList.remove ('hidden');
    wordContainer.classList.add ('hidden');
  }
  else {
    spinner.classList.add ('hidden');
    wordContainer.classList.remove ('hidden');
  }
}
const manageModalSpinner = (status) => {
  const spinner = document.getElementById ('spinner');
  const modal = document.getElementById ('modal-details');
  if (status === true) {
    spinner.classList.remove ('hidden');
    modal.classList.add ('hidden');
  }
  else {
    spinner.classList.add ('hidden');
    modal.classList.remove ('hidden');
  }
}

const loadLessons = () => {
    fetch ('https://openapi.programming-hero.com/api/levels/all')
    .then (res => res.json ())
    .then (json => displayLessons (json.data))
}

const removeActive = () => {
  const lessonBtn = document.querySelectorAll ('.lesson-btn');
  lessonBtn.forEach (btn => {
    btn.classList.remove ('bg-[#422AD5]', 'text-white');
  })
}

const loadLessonWord = (id) => {
    manageSpinner (true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch (url)
    .then (res => res.json ())
    .then (data => {
      removeActive ();
      const clickBtn = document.getElementById (`click-btn-${id}`);
      clickBtn.classList.add ('bg-[#422AD5]', 'text-white');
      displayLessonWord (data.data);
    })
}

const loadWordDetails = async (id) => {
  manageModalSpinner (true);
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch (url);
  const details = await res.json ();
  displayLoadWordDetails (details.data);
}

const displayLoadWordDetails = (details) => {
  console.log(details);

    const modalBox = document.getElementById ('modal-details');
    modalBox.innerHTML = `
     <div>
        <h2 class="text-3xl font-semibold font-bangla">${details.word} (<i class="fa-solid fa-microphone-lines"></i>    :${details.pronunciation})</h2>
      </div>

      <div class="space-y-3">
        <h3 class="text-2xl font-semibold">Meaning</h3>
        <p class="text-2xl font-medium text-gray-900 font-bangla">${details.meaning}</p>
      </div>

      <div class="space-y-3">
        <h3 class="text-2xl font-semibold">Example</h3>
        <p class="text-2xl text-gray-700">${details.sentence}</p>
      </div>

      <div class="space-y-4">
        <h3 class="text-2xl font-medium">সমার্থক শব্দ গুলো</h3>
        <div class="space-x-2">${createElements (details.synonyms)}</div>
   `;

  const modalWord = document.getElementById ('modal_word');
  modalWord.showModal ();

  manageModalSpinner (false);
}

const displayLessonWord = (words) => {
    const wordContainer = document.getElementById ('word-container');
    wordContainer.innerHTML = '';
    if (words.length < 1) {
      wordContainer.innerHTML = `
      <div class="col-span-full text-center space-y-3 py-8">
          <img class = "mx-auto" src = "./assets/alert-error.png"/>
          <p class="text-sm text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
          <h2 class="text-4xl font-medium font-bangla">নেক্সট Lesson এ যান</h2>
        </div>
      `
      manageSpinner (false);
      return;
    } 

    words.forEach (word => {
        console.log(word);
        
        const cardDiv = document.createElement ('div');
        cardDiv.className = 'bg-base-100 rounded-xl py-12 px-8 shadow-sm text-center space-y-6';
        cardDiv.innerHTML = `
          <h2 class="text-3xl font-bold">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
          <p class="text-xl font-medium">meaning / pronunciation</p>
          <div class="font-bangla text-3xl font-semibold text-gray-600">"${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'উচ্চারণ পাওয়া যায়নি'}"</div>
          <div class="flex justify-between">
            <button onclick = "loadWordDetails (${word.id})" class="btn bg-sky-100 hover:bg-sky-200"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick = "pronounceWord ('${word.word}')" class="btn bg-sky-100 hover:bg-sky-200"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        `;
        wordContainer.appendChild (cardDiv);
    })
    manageSpinner (false);
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
         <button id = "click-btn-${lesson.level_no}" onclick = "loadLessonWord (${lesson.level_no})" class = 'btn btn-outline btn-primary lesson-btn'>
         <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no} 
         </button>
        `
        // 4.append into container
        levelContainer.appendChild (btnDiv);
    }
}

loadLessons ();

document.getElementById ('search-btn').addEventListener ('click', () => {
  removeActive ();
  const inputSearch = document.getElementById ('input-search');
  const searchValue = inputSearch.value.trim ().toLowerCase ();
  console.log(searchValue);
  
  fetch ('https://openapi.programming-hero.com/api/words/all')
  .then (res => res.json ())
  .then (data => {
    const allWords = data.data;
    const filterWords = allWords.filter (word => word.word.toLowerCase ().includes (searchValue));
    displayLessonWord (filterWords);
  })
})