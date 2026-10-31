BRØYTINGSSIDE – NETLIFY-VERSJON
================================

Denne versjonen bruker Netlify Forms i stedet for Cloudflare Worker/e-postkode.

DET SOM ER FERDIG
-----------------
- Kontaktskjema med Send-knapp
- Navn, telefon, e-post, adresse/område, oppdragstype og melding
- Netlify honeypot mot enkel spam
- AJAX-innsending uten sidebytte
- 7-dagers vær for Hokksund
- Kun ett ATV-bilde
- Mobilvennlig side

SLIK LEGGER DU DEN UT
---------------------
Enklest:
1. Logg inn på Netlify.
2. Opprett et nytt nettsted ved å dra denne mappen/ZIP-innholdet inn i Netlify Drop,
   eller bruk "Add new project" -> deploy manually.
3. Når siden er deployet:
   - Gå til Forms.
   - Velg "Enable form detection" hvis Netlify ber om det.
   - Deploy siden på nytt hvis du måtte aktivere form detection etter første deploy.
4. Send én testmelding fra nettsiden.
5. Gå til Forms -> Submission notifications -> Add notification -> Email notification.
6. Sett mottaker til:
      morgan@helmen.no

Da sender Netlify e-postvarsel til deg når skjemaet blir sendt inn.

VIKTIG
------
Netlify må oppdage skjemaet i HTML-en under deploy. Skjemaet heter:
    broyteforesporsel

E-postfeltet heter "email". Netlify bruker dette som Reply-To i e-postvarsler,
så når noen fyller inn e-postadressen sin kan du normalt trykke Svar i varselet.

DOMENE
------
Du kan fortsette å ha DNS hos Cloudflare og bare peke helmen.no/www til Netlify.
Netlify viser nøyaktige DNS-verdier under:
    Domain management -> Add a domain

VÆR
----
Værdata hentes direkte fra Open-Meteo for Hokksund og krever ingen API-nøkkel.

