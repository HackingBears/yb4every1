## YB Multiplayer Game

### Deployment Prozess:
- Service-worker im index.html aktivieren (auskommentierung entfernen)
- WebApp builden (vorher dist Verzeichnis löschen): npm run-script build
- Hochladen auf OpenShift (vorher wechsel ins dist Verzeichnis): oc start-build hackathon-ui --wait=true --from-dir .

