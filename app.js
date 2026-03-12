/* ROADMAP FOR STAGE 6

- This Stage 5 version implements the core game logic for the Temporal Tides module.
- Cards are stored as objects in a reactive array, matched using pairId values, and display research-informed content through dialog windows. 
- Game state is tracked using selectedCards, pairsFound, moves, and progress().

Current limitations:
- citations are embedded as plain text URLs inside content strings
- progress alerts are functional but not visually prominent

Next improvements for Stage 6:
1. Code review and efficiency
- review logic for any potential edge cases (eg. dialog close flow, mismatch resets, repeated clicks)

2. Improve progress feedback visibility
- make the Game Progress alert more visually prominent (size or placement)
- refine alert messaging for match, mismatch, reset, and game completion states

3. Improve citation formatting
- move source links out of the content string and store them in a dedicated sources array
- render citations in the dialog as clean, clickable links so users can access references directly

4. UI and interaction polish
- improve responsiveness and spacing across screen sizes
- add a clearer completion state when all pairs are matched

*/

const { createApp, ref } = Vue;
const { createVuetify } = Vuetify;
const vuetify = createVuetify();

createApp({
  setup() {
  

    // "cards" is a reactive array (wrapped in ref) so the UI updates when values change where each card represents one "tile" on the board
    // Pair rules - cards match if their "pairId" is the same
    const cards = ref([
      
      // Pair 1 (these two cards share pairId = 1)
      {
        pairId: 1,
        color: "#E3F2FD",          // this is for the theme colour for the card & dialog (this changes depending on the pairId)
        title: "Port of Savannah Holiday Shipping Peak",
        location: "Port of Savannah, Georgia, USA",
        timeRange: "November - January",
        content: "The Port of Savannah is one of the busiest container ports in the United States and a major gateway for goods entering the Southeast. In the 2023 fiscal year the port handled over 5.4 million twenty-foot equivalent units (TEUs) of cargo, making it one of the fastest-growing container ports in North America. [1] Shipping activity particularly increases between the months of November and January as retailers import large volumes of goods ahead of the holiday shopping season.\n\nTo keep goods moving efficiently, container ships operate according to tightly coordinated schedules that link ships with trucks and distribution centers. These logistics systems prioritize predictable arrival times and rapid cargo transfer. As a result, vessel traffic increases along major shipping corridors serving East Coast ports, including routes that pass through waters off Georgia and Florida. [2]\n\n1. https://gaports.com/facilities/port-of-savannah/\n2. https://www.bts.gov/content/americas-container-ports",
        image: "images/portsavannah.jpg",
        flipped: false,             // this will be "true" when card is currently showing face-up
        matched: false,             // this will be "true" once the pair is correctly matched (stays face-up for the rest of the game)
        showContent: false          // this controls the dialog pop up visibility - starts false because none visible yet!
      },
      { pairId: 1, 
        color: "#E3F2FD", 
        title: "North Atlantic Right Whale Calving Season", 
        location: "Coastal waters off Georgia and Florida, USA", 
        timeRange: " Mid-November - Mid-April", 
        content: "Each winter, North Atlantic right whales migrate from feeding grounds in the North Atlantic to warm coastal waters off Georgia and Florida to give birth. NOAA identifies this region as the species’ primary calving ground, with most births occurring between mid-November and mid-April. The species is critically endangered, with an estimated population of fewer than 360 individuals remaining[1].\n\nNewborn calves measure roughly 4–5 meters in length and depend on their mothers while nursing and developing strength. Mothers and calves often swim slowly and spend extended periods near the ocean surface, behaviors that make them particularly vulnerable to vessel strikes [1]. Ship collisions and fishing gear entanglements are among the leading causes of injury and mortality for the species, because these same coastal waters are used by major shipping routes along the Southeast U.S. coast, whale calving occurs in areas with regular vessel traffic [2].\n\n1. https://www.fisheries.noaa.gov/species/north-atlantic-right-whale\n2. https://www.fisheries.noaa.gov/national/endangered-species-conservation/reducing-vessel-strikes-north-atlantic-right-whales",
        image: "images/northatlantic.jpg",
        flipped: false, 
        matched: false, 
        showContent: false },

      // Pair 2
      { pairId: 2, 
        color: "#E8F5E9", 
        title: "Humpback Whale Mating Season", 
        location: "The ocean around Ogasawara islands, Okinawa and the Philippines", 
        timeRange: "December - March ", 
        content: "The humpback whale breeding season occurs from December to March in the Northern Hemisphere. After the breeding season, the pregnant female will migrate to feeding grounds to gain strength for a successful birth before migrating back to the breeding grounds to give birth after a gestation of 11.5 months. Male humpback whales often make long and complex “songs” to compete for female attention during the breeding season. [1] \n\nThe breeding ground for humpback whales in the Philippines is located in the waters around the Babuyan Islands in the Babuyan Marine Corridor. The whales around the Babuyan Islands are part of the Western North Pacific Distinct Population segment, which is one of four humpback whale population segments that are still listed as endangered. The statistics indicate that there is a small population of humpback whales using this breeding ground with a high rate of return. [2]\n\n 1.https://wwhandbook.iwc.int/en/species/humpback-whale#:~:text=Reproduction,of%20approximately%2011.5%20months3.\n2. https://www.marinemammalhabitat.org/factsheets/babuyan-marine-corridor/", 
        image: "images/humpbackwhale.png", 
        flipped: false, 
        matched: false, 
        showContent: false },

      { pairId: 2, 
        color: "#E8F5E9", 
        title: "Luzon Strait Maritime Shipping", 
        location: "Luzon Strait, near the Babuyan Islands ", 
        timeRange: "Year-round", 
        content: "The Luzon Strait extends for over 200 miles between the islands of northern Taiwan and Luzon, Philippines. This strait is very important as it connects the South China Sea with the Philippine Sea. The strait contains a series of channels, with the main channels including the Bashi (North), Balintang (central) and Babuyan (South) channels. [1]\n\nThe Luzon Strait is a major shipping lane connecting East Asia to the Western Pacific. This strait is both wide enough to fit larger ships and one of the quickest routes between South-East Asia and the rest of the world. The sound from these ships affects the mating process of humpback whales in the Babuyan Marine Corridor, as they mute the male humpback whale songs. While the purpose of humpback whale songs is unknown, males tend to exhibit this behaviour during the mating season. [2]\n\n1. https://www.britannica.com/place/Luzon-Strait\n2. https://www.pbs.org/wgbh/nova/article/ships-noises-humpback-whale-song/", 
        image: "images/luzonstrait.png", 
        flipped: false, 
        matched: false, 
        showContent: false },

      // Pair 3
      { pairId: 3, 
        color: "#FFF3E0", 
        title: "Santa Barbara Shipping Corridor", 
        location: "Santa Barbara Channel, California, USA", 
        timeRange: "Year-round (heavy traffic throughout the year)", 
        content: "The Santa Barbara Channel is a narrow marine passage between the California mainland and the Channel Islands National Park that is an important transit route for vessels traveling along the U.S. West Coast. Ships have to pass through this corridor to move between the Port of Los Angeles and Port of Long Beach, to participate in the trans-Pacific container trade, which facilitates over $470 billion of trade annually. [1] \n\nLarge container ships traveling through these lanes commonly move at speeds above 10 knots, the range at which the risk and severity of whale collisions increases by nearly 50%. [1][2] Research using vessel-tracking data has shown that this region sees some of the highest densities of commercial vessel traffic along the U.S. West Coast. [1] Because the shipping lanes run directly across the channel rather than farther offshore, vessels repeatedly pass through the same waters that support seasonal whale feeding activity.\n\n1. https://doi-org.libaccess.lib.mcmaster.ca/10.1016/j.ocecoaman.2017.07.013\n2.https://bluewhalesblueskies.org/impact/reducing-ship-strikes/#facts", 
        image: "images/santabarbara.png", 
        flipped: false, 
        matched: false, 
        showContent: false },

      { pairId: 3, 
        color: "#FFF3E0", 
        title: "Blue Whale Feeding Season", 
        location: "Santa Barbara Channel, California, USA", 
        timeRange: "May – October", 
        content: "During the late spring and summer months, the waters of the Santa Barbara Channel become an important feeding area for the Blue Whale. Seasonal wind-driven upwelling along the California coast brings nutrient-rich water to the surface, producing dense concentrations of krill. This attracts blue whales migrating along the eastern Pacific coast, and the channel regularly hosts feeding groups during the May–October period. [1]\n\nBlue whales forage using repeated lunge-feeding dives in which they accelerate upward through krill swarms near the surface. This behavior places them directly within the depth range of passing ships. Because both ships and whales concentrate in the same waters during the feeding season, the Santa Barbara Channel has been identified as a significant collision-risk area for blue whales along the U.S. West Coast, with an estimated 80 whales killed off the US Coast a year. [2]\n\n1.https://conbio-onlinelibrary-wiley-com.libaccess.lib.mcmaster.ca/doi/full/10.1111/cobi.12029\n2.https://bluewhalesblueskies.org/impact/reducing-ship-strikes/#facts", 
        image: "images/bluewhale.png", 
        flipped: false, 
        matched: false, 
        showContent: false },

      // Pair 4
      { pairId: 4, 
        color: "#F3E5F5", 
        title: "Mediterranean Shipping Traffic", 
        location: "Ligurian Sea (North-Western Mediterranean)", 
        timeRange: "Year-round commercial traffic", 
        content: "The Ligurian Sea, located between the coasts of France, Italy, and Monaco, sits along one of the principal shipping corridors of the north-western Mediterranean. Cargo vessels, ferries, and tankers regularly move through this region while connecting major ports such as Genoa, Marseille, and Barcelona. These routes form part of the wider maritime network linking the Mediterranean with the Atlantic Ocean through the Strait of Gibraltar. [1]\n\nShipping density in the area is particularly significant because these routes cross the Pelagos Sanctuary, a marine protected area created by France, Italy, and Monaco to protect cetaceans. Despite its protected status, the sanctuary remains heavily affected by maritime traffic due to the concentration of commercial ports and shipping lanes along its coasts. Researchers mapping vessel traffic in the sanctuary have identified persistent collision-risk zones where major shipping routes intersect with areas of high cetacean occurrence. [1] \n\n1.https://www-sciencedirect-com.libaccess.lib.mcmaster.ca/science/article/pii/S0964569121003033", 
        image: "images/mediterranean.png", 
        flipped: false, 
        matched: false, 
        showContent: false },

      { pairId: 4, 
        color: "#F3E5F5", 
        title: "Fin Whale Feeding Habitat in Pelagos", 
        location: "Pelagos Sanctuary and Ligurian Sea, Mediterranean", 
        timeRange: "July - September (peak seasonal presence)", 
        content: "The Fin Whale is the largest whale species regularly found in the Mediterranean Sea and occurs seasonally in the Ligurian Sea, where it feeds on dense aggregations of northern krill. Seasonal oceanographic fronts concentrate krill in this region during the summer months, drawing feeding whales into the same waters that host heavy maritime traffic. [1]\n\nShip strikes are considered the largest human-caused threat to Mediterranean fin whales, and collision records show that a large proportion of fatal incidents occur in or near the Pelagos Sanctuary. [2] A review of ship-strike data found that 82% of documented fatal collisions between 1972 and 2001 occurred in the Ligurian Sea region, highlighting the intensity of overlap between whale feeding habitat and shipping traffic. [1]\n\nRecent conservation assessments note that this area remains a major collision hotspot, where high-speed vessels crossing the sanctuary intersect with critical whale habitat. [2]\n\n1.https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2022.867287\n2.https://pelagos-sanctuary.org/threats", 
        image: "images/finwhale.png", 
        flipped: false, 
        matched: false, 
        showContent: false }, ]);

    
    // Stores the currently selected cards (max is 2 at a time) - starts empty because no cards have been selected yet!
    const selectedCards = ref([]);

    // Counts how many "turns" the player has taken (1 move = flipping TWO cards and attempting a match)
    const moves = ref(0);

    // Counts how many pairs have been successfully matched thus far in the game 
    const pairsFound = ref(0);

    // Total number of pairs in the game (is used for the progress calculations)
    const totalPairs = 4;

    // Alert text and type for the progress panel feedback - This is the starting message upon starting the game.
    const alertMessage = ref("Click a card to begin.");
    const alertType = ref("info"); 

    // lockBoard will prevent clicking more cards while the game is resolving a pair and starts false as no cards will have been selected yet!
    const lockBoard = ref(false);

    // "lastResult" will keep track of whether the last two cards were a match or mismatch - but intially starts empty as no cards have been selected yet!
    // We will use this in closeCard() function to decide whether or not to flip cards back down
    const lastResult = ref("");

  
 // Progress calculation - Will be a value between 0 - 100 and will be used for v-progress-linear)
    function progress() {
      return (pairsFound.value / totalPairs) * 100; }

    // This is the randomization function that will shuffle the cards array in-place (we are using the Fisher-Yates shuffle here)
    // This will ensure that a new card grid layout is presented each time the game loads or is reset to keep it engaging!
    function shuffleCards() {
     
      // this unwraps ref to get the actual array
      const arr = cards.value; 
      for (let i = arr.length - 1; i > 0; i--) {
        
        // This picks a random index from 0..i
        const j = Math.floor(Math.random() * (i + 1));

        // Here we are swapping arr[i] and arr[j] to get the shuffled card grid!
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;  }}

    // This function will decides what background colour the card should use
    // When cards are face-down, they will use a neutral/gray colour so that the "pair theme" remains hidden. 
    function cardBtnColor(card) {
      
      // if the card is still hidden and not matched, show neutral grey backgroud card colour
      if (card.flipped === false && card.matched === false) {
        return "#ECEFF1"; }
      
        // if the card is flipped or matched, show the pair theme colour (these colours are being pulled from the cards array)
      return card.color;}

    // This is the corresponding dialog background colour that matches the card background colours 
    function dialogColor(card) {
      return card.color; }

    // This is the main function for when the user clicks a card....
    function flipCard(card) {
     
      // If card is already matched, we don't change game state and we only allow the user to re-open the info dialog for reading
      if (card.matched === true) {
        card.showContent = true;
        return; }

      // These are the rules that will block the flipping of a card: 
      
        // (1) Board is "locked" while we are checking a pair
        if (lockBoard.value === true) return;

        // (2) If card is already flipped, then ignore duplicate click
        if (card.flipped === true) return;

        // (3) If user already has 2 cards selected, the don't allow a third one (or more) to be clicked
        if (selectedCards.value.length === 2) return;

      // Otherwise then, we will flip the card face up and open its info dialog so user can read and engage with the content. 
      card.flipped = true;
      card.showContent = true;

      // Track this card as selected (so we can compare it later when user has selected another card). 
      selectedCards.value.push(card);

      // Once we have exactly 2 selected cards, that counts as one "move" - "move" counter increases by one
      // We will then also check if the 2 selected cards match using our checkMatch() function
      if (selectedCards.value.length === 2) {
        moves.value = moves.value + 1;
        checkMatch(); } }

    // This function compares the 2 selected cards and will update game state accordingly
    function checkMatch() {
      
      // Lock the board so player cannot click other cards while result is still pending
      lockBoard.value = true;

      // Grab the 2 selected card objects in the "selectedCards" array
      const first = selectedCards.value[0];
      const second = selectedCards.value[1];

      // A card match will be determined by matching pairId values and seeing if they are equal or not equal
      
      // If the pairIDs are qual then both cards will be marked as permanently matched - they will stay face-up!
        if (first.pairId === second.pairId) {
        first.matched = true;
        second.matched = true;

        // Increase pair count for progress tracking (increase by one)
        pairsFound.value = pairsFound.value + 1;

        //Call the progress function here to calculate the value which will be modelled through progress bar (in index.html)
        progress ();

        // Update alert styling and the alert message
        alertType.value = "success";

        // If all pairs have been found then show a final game win message!
        if (pairsFound.value === totalPairs) {
          alertMessage.value = "You matched all pairs!"; } 
        
        //Otherwise, we will still show a "success" type alert but the alert message will just say "found a pair!"
        else {  alertMessage.value = "Found a pair!";}

        // Save last result so closeCard () knows not to flip the cards back
        lastResult.value = "match";

        // Clear selection in the "selectedCards" array and unlock board again so that user can continue playing the game
        selectedCards.value = [];
        lockBoard.value = false; } 
        
        else {
        
        // This is in the case of a "mismatch" meaning that the two cards selected do not have an equal pairId...
        // We don't flip them back immediately - we wait until the dialog pop up has been closed by the user so the player has time to read the information first
        alertType.value = "warning";
        alertMessage.value = "Try again! Not a match.";
        lastResult.value = "mismatch"; }}

    // This "closeCard" function will be called whenever the user closes a dialog (aka presses the "close" button on the dialog pop up)
    // This function decides whether mismatched cards should flip back down
    function closeCard(card) {
      
      // Close the dialog for the current card
      card.showContent = false;

      // Only flip the cards back down if: (1) exactly 2 cards were selected AND (2) the last result was a mismatch
      if (selectedCards.value.length !== 2) return;
      if (lastResult.value !== "mismatch") return;

      // Grab the two selected cards from the "selectedCards" array
      const first = selectedCards.value[0];
      const second = selectedCards.value[1];

      // Close both dialogs (if for some reason/case one is still open!)
      first.showContent = false;
      second.showContent = false;

      // Also flip both cards back to being face-down again
      first.flipped = false;
      second.flipped = false;

      // Reset the selection ("selectedCards" array) and unlock board so user can take another turn
      selectedCards.value = [];
      lockBoard.value = false;
      lastResult.value = ""; }
    
    // Resets the game to a clean starting state (everything restarts to what it initially started at )
    function resetGame() {
      
      // Reset both counters to zero
      moves.value = 0;
      pairsFound.value = 0;

      // Reset selection to be empty and the lock status to be false because no cards will have been selected yet!
      selectedCards.value = [];
      lockBoard.value = false;
      lastResult.value = "";

      // Reset the alert type and message to the starting message again. 
      alertType.value = "info";
      alertMessage.value = "Game reset! Click a card to begin.";

      // Reset every card back to default face-down state ( we have to use "i" here because of the shuffle function used to shuffle card grid above)
      const arr = cards.value;
      for (let i = 0; i < arr.length; i++) {
        arr[i].flipped = false;
        arr[i].matched = false;
        arr[i].showContent = false; }

      // Here we actually call the "shuffleCards" function to make the new game layout different once "Reset Game" button clicked to keep game engaging!
      shuffleCards(); }

    
    // Here we call "shuffleCards" again to run once the page has been loaded/reloaded - but has the exact same effect (simply resets the game)
    shuffleCards();

    // Everything returned here becomes available to be used in index.html
    return {
      cards,
      selectedCards,
      moves,
      pairsFound,
      totalPairs,
      alertMessage,
      alertType,
      progress,
      cardBtnColor,
      dialogColor,
      flipCard,
      closeCard,
      resetGame,
    }; }, })
  
  .use(vuetify)
  .mount("#app");