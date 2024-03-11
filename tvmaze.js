"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $('#episodesList');

const apiKey =  'D1quGqOpfEW8eJs2ZwycOCqu9GWMtpCm';
const username = 'jeromeMMP' 
const missingImg = 'https://tinyurl.com/tv-missing';

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function searchShow(term){
  const showSearched = await axios.get('https://api.tvmaze.com/search/shows', 
    {params:
      {
        q:term
      }
    }
  )
  return showSearched.data; 
 
}

async function getShowsByTerm( ) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary:
        `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
           women with extraordinary skills that helped to end World War II.</p>
         <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
           normal lives, modestly setting aside the part they played in
           producing crucial intelligence, which helped the Allies to victory
           and shortened the war. When Susan discovers a hidden code behind an
           unsolved murder she is met by skepticism from the police. She
           quickly realises she can only begin to crack the murders and bring
           the culprit to justice with her former friends.</p>`,
      image:
        "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ];
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let data of shows) {
    const $show = $(
      `<div data-show-id="${data.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="
              ${data.show.image.original !== '' || null || 'null' ?  data.show.image.original: missingImg } "
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${data.show.name}</h5>
             <div><small>${data.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}




/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  // const shows = await getShowsByTerm(term);
  const shows = await searchShow(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  
  
  //emptying search value
  $searchForm.val('');
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id){
  const showEpisodes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  return showEpisodes.data;

}


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
function populateEpisodes(episodes){
  $episodesList.empty(); 

  for (let episode of episodes){
    const $epi = $(
      `<li> 
          <div data-episode-ID ="${episode.id}">
            <p>Title: <b> ${episode.name}</b> </p>
            <small>Number: <b>${episode.number}</b>
            <br>
            Season: <b> ${episode.season}</b>
            </small>
          </div>
        
        </li>
      `
    )
    $episodesList.append($epi);
  }


}


$showsList.on("click" , "button", async function(e){
  $episodesArea.show()
  const parent = $(e.target).parent().parent().parent();
  const showID = parent.attr('data-show-id'); 
  const listOfEpisodes = await getEpisodesOfShow(showID);
  
  populateEpisodes(listOfEpisodes);
} )



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
