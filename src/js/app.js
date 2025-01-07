$(document).ready(function () {
  const API_URL = "https://script.google.com/macros/s/AKfycbxvbJIyvl-St7NgmDtqPtOeekYtjdjvTNGCYH-b9Nba4j5APwbPCEpXfT6GJSSF9Oy6Zg/exec";
  let deferredPrompt = null; // Variable pour stocker le prompt d'installation

  // Fonction pour récupérer une citation aléatoire
  function fetchCitations() {
    const $citationText = $('#citation-text');
    const $citationAuthor = $('#citation-author');
    const $citationDescription = $('#citation-description');
    const $citationPhoto = $('#citation-photo');
    const $loadercitation=$('#loader-contain');
    // Afficher un texte de chargement pendant l'appel API
    $citationText.text("Le suivant arrive...");
    $loadercitation.show();
  

    // Appel AJAX pour récupérer les citations
    $.ajax({
      url: API_URL,
      method: 'GET',
      cache: false,
      success: function (data) {
        // Vérifier que l'API renvoie des données valides
        if (data && Array.isArray(data) && data.length > 0) {
          const randomCitation = data[Math.floor(Math.random() * data.length)];
          $citationText.text(randomCitation.Citation || "Citation indisponible.");
          $loadercitation.hide();
          $citationAuthor.text(randomCitation.Auteur || "Auteur inconnu.");
          $citationDescription.text(randomCitation.Description || "");
          $citationPhoto.attr('src', randomCitation.Photo ? 'img/' + randomCitation.Photo : "img/default-avatar.png");
          $citationPhoto.attr('alt', randomCitation.Auteur || "Auteur");
        } else {
          $citationText.text("Aucune citation disponible.");
        }
      },
      error: function () {
        $citationText.text("Une erreur s'est produite. Veuillez réessayer.");
      }
    });
  }


  

  // Charger une citation initiale
  fetchCitations();

  // Attacher l'événement de clic au bouton Refresh
  $('#refreshButton').on('click', function () {
    fetchCitations(); // Recharger une nouvelle citation
  });

  $('#iosbutton').on('click', function () {
    $('#imageContainer').toggleClass('hidden'); // Afficher/masquer l'image
  });

  // Fonction pour afficher/masquer les boutons en fonction du type de périphérique
  function handleDevice() {
    const md = new MobileDetect(window.navigator.userAgent);

    if (md.mobile()) {
      // Si mobile, afficher le bouton d'installation (Android ou iOS)
      if (md.is('iPhone')) {
        $('#iosbutton').removeClass('hidden').show();
        $('#installAppButton').hide();
      } else if (md.is('AndroidOS')) {
        $('#installAppButton').removeClass('hidden').show();
        $('#iosbutton').hide();
      }
    } else {
      // Si desktop, cacher les boutons d'installation
      $('#installAppButton').hide();
      $('#iosbutton').hide();
    }
  }

  // Appeler la fonction pour gérer les appareils mobiles
  handleDevice();

  // Gérer l'installation de l'application PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage du prompt d'installation par défaut
    e.preventDefault();
    deferredPrompt = e;
    // Afficher le bouton d'installation
    $('#installAppButton').show();
  });

  // Écouter le clic sur le bouton d'installation
  $('#installAppButton').on('click', async () => {
    // Afficher le prompt d'installation
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log(`Résultat d'installation: ${result.outcome}`);
      deferredPrompt = null;
      $('#installAppButton').hide(); // Masquer le bouton après l'installation
    }
  });
});
