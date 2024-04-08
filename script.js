const playlistSongs = document.getElementById('playlist-songs');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
    {
        id: 0,
        title: "Scratching The Surface",
        artist: "Quincy Larson",
        duration: "4:25",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
    },

    {
        id: 1,
        title: "Can't Stay Down",
        artist: "Quincy Larson",
        duration: "4:15",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
    },

    {
        id: 2,
        title: "Still Learning",
        artist: "Quincy Larson",
        duration: "3:51",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
    },

    {
        id: 4,
        title: "Never Not Favored",
        artist: "Quincy Larson",
        duration: "3:35",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
    },
    {
        id: 5,
        title: "From the Ground Up",
        artist: "Quincy Larson",
        duration: "3:12",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
    },
    {
        id: 6,
        title: "Walking on Air",
        artist: "Quincy Larson",
        duration: "3:25",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
    },
    {
        id: 7,
        title: "Can't Stop Me. Can't Even Slow Me Down.",
        artist: "Quincy Larson",
        duration: "3:52",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
        id: 8,
        title: "The Surest Way Out is Through",
        artist: "Quincy Larson",
        duration: "3:10",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
    },
    {
        id: 9,
        title: "Chasing That Feeling",
        artist: "Quincy Larson",
        duration: "2:43",
        src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
    },

    ];


const audio = new Audio();

let userData = {
    songs: [...allSongs], //Estamos creando una copia del array original y lo estamos almacenando dentro de userData
    currentSong: null,
    songCurrentTime: 0,
  };


//Funcionalidad para reproducir las canciones mostradas. El id representará el identificador único de la canción que desea reproducir.
// El find realizará la iteración 
// La expresión song.id === id es una condición de comparación que compara el id de cada canción con el id pasado como argumento a la función playSong.

const playSong = (id) => {
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
      } else {
        audio.currentTime = userData?.songCurrentTime;
      }
      userData.currentSong = song;

    playButton.classList.add('playing');
    highlightCurrentSong(); // Llama a la función que va a resaltar las reporducciones
    audio.play();
    setPlayerDisplay();
    setPlayButtonAccessibleText();

};


// Función para pausar las canciones
const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove('playing');
    audio.pause();
};



// Función para reproducir una canción siguiente
const playNextSong = () => { 
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
      } else {
        const currentSongIndex = getCurrentSongIndex();
    
        const nextSong = userData?.songs[currentSongIndex + 1] 
    
        playSong(nextSong.id)
    
      }
};



// Función para poder retroceder la canción
const playPreviousSong = () => {
    if (userData?.currentSong === null) {
        return
      } else {
        const currentSongIndex = getCurrentSongIndex();

        const previousSong = userData?.songs[currentSongIndex - 1]

        playSong(previousSong.id);
      }
};


// Función para mezclar las canciones y realizar las actualizaciones necesarias de administración del estado después de la mezcla
const shuffle = () => {
    userData?.songs.sort(()=> Math.random() - 0.5)
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
}

//Función para borrar una canción
const deleteSong = (id) => {
    if(userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;

        pauseSong();
        setPlayerDisplay();
    }

    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs); 
    highlightCurrentSong(); 
    setPlayButtonAccessibleText(); 

    if (userData?.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");

        resetButton.id = "reset";
        resetButton.ariaLabel = "Reset playlist";

        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            userData.songs = [...allSongs];

            renderSongs(sortSongs());
            setPlayButtonAccessibleText();
            resetButton.remove(); 
        });

    }
}


//Función para mostrar el título de la canción actual y el artista
const setPlayerDisplay = () => {
    const playingSong = document.getElementById('player-song-title');
    const songArtist = document.getElementById('player-song-artist');
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    playingSong.textContent = currentTitle ? currentTitle : '';
    songArtist.textContent = currentArtist ? currentArtist : '';
}


// Función para resaltar canción seleccionada
const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll('.playlist-song');

    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
// Recorrerá los playlistSongElements con un método forEach.
playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
});  

if (songToHighlight) {
    songToHighlight.setAttribute("aria-current", "true");
  }

};




//Se crea esta función para mostrar las canciones   
const renderSongs = (array) => {
    const songsHTML = array.map((song)=> {
        
        return `
        <li id="song-${song.id}" class="playlist-song"> 
            <button class="playlist-song-info" onclick="playSong(${song.id})">  <!-- reproducción al clikear en cualquier parte de la canción-->
                <span class="playlist-song-title">${song.title}</span>
                <span class="playlist-song-artist">${song.artist}</span>
                <span class="playlist-song-duration">${song.duration}</span>
        </button> 
        
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button> 
        </li>
        `;
    }).join("");

    playlistSongs.innerHTML = songsHTML; // Para actualizar la lista de reproducción en el documento HTML para mostrar las canciones

};

// Función para que al inicio de la app muestre alguna canción o al menos el título de la primera canción
const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0] //Se obtiene la canción que se reproduce o la primera del array
    playButton.setAttribute(
        "aria-label",
        song?.title ? `Play ${song.title}` : "Play"
       )
};




// Funcionalidad botón de siguiente y atrás
const getCurrentSongIndex = () => {
    return userData?.songs.indexOf(userData?.currentSong)
  }


// Funcionalidad del botón de reproducción
// Si userData?.currentSong es null, significa que no hay una canción en reproducción, entonces se llama a la función playSong con el id de la primera canción en el arreglo userData?.songs
// Si userData?.currentSong no es null, significa que ya hay una canción en reproducción. En este caso, se llama a la función playSong con el id de la canción actualmente en reproducción (userData?.currentSong.id)

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
      } else {
        playSong(userData?.currentSong.id);
      }
    });

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener('click',shuffle);

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = getCurrentSongIndex() < userData.songs.length -1;

    if (nextSongExists) {
        playNextSong();
      } else {
          userData.currentSong = null;
          userData.songCurrentTime = 0;

        pauseSong();
        setPlayerDisplay();
        highlightCurrentSong();
        setPlayButtonAccessibleText();
        }
  }); 


// Ordenar las canciones
const sortSongs = () => {
    userData?.songs.sort((a,b) => {
      if (a.title < b.title) {
        return -1;
      }
  
      if (a.title > b.title) {
        return 1;
      }
  
      return 0;
    });

    return userData?.songs;

};

//renderSongs(userData?.songs);    // Se invoca a la función renderSongs pasando como argumento el valor de la propiedad songs del objeto userData. `?.` es una forma segura de acceder a la propiedad songs del objeto userData. Si no existe, en vez de ver error, veré un undefined o null. Esra línea de código fue reemplazada por "renderSongs(sortSongs());". Esto solo mostraba en un iniio la lista desordenada

renderSongs(sortSongs()); // Al llamar a esta función, se ordena la lista de las conciones