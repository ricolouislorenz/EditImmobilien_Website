import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ExternalLink } from "lucide-react";

interface DatenschutzProps {
  children: React.ReactNode;
}

export function Datenschutz({ children }: DatenschutzProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#C2A878]">Datenschutzerklärung</DialogTitle>
        </DialogHeader>

        <DatenschutzContent />
      </DialogContent>
    </Dialog>
  );
}

export function DatenschutzContent() {
  return (
    <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-[#C2A878] mb-2 mt-4">Allgemeine Hinweise</h3>
            <p className="mb-3">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Datenerfassung auf dieser Website</h3>
            
            <h4 className="text-white mb-2 mt-3">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p className="mb-3">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
            </p>

            <h4 className="text-white mb-2 mt-3">Wie erfassen wir Ihre Daten?</h4>
            <p className="mb-3">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p className="mb-3">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
            </p>

            <h4 className="text-white mb-2 mt-3">Wofür nutzen wir Ihre Daten?</h4>
            <p className="mb-3">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>

            <h4 className="text-white mb-2 mt-3">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p className="mb-3">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Diese erreichen Sie unter: Hamburgische Beauftragte für Datenschutz und Informationsfreiheit (HmbBfDI). <a href="mailto:mailbox@datenschutz.hamburg.de" className="text-[#C2A878] hover:underline">mailbox@datenschutz.hamburg.de</a>
            </p>
            <p className="mb-3">
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Analyse-Tools und Tools von Drittanbietern</h3>
            <p className="mb-3">
              Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten Analyseprogrammen.
            </p>
            <p className="mb-3">
              Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in der folgenden Datenschutzerklärung.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">2. Hosting</h2>
            <p className="mb-3">Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
            
            <h3 className="text-[#C2A878] mb-2 mt-4">Cloudflare</h3>
            <p className="mb-3">
              Anbieter ist die Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA (nachfolgend „Cloudflare"). Cloudflare stellt unsere Website über ein weltweit verteiltes Content-Delivery-Network bereit. Dabei wird der Datenverkehr zwischen Ihrem Browser und unserer Website technisch über die Server von Cloudflare geleitet. Hierbei verarbeitet Cloudflare verschiedene Logfiles inklusive Ihrer IP-Adresse. Details entnehmen Sie der Datenschutzerklärung von Cloudflare: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-[#C2A878] hover:underline inline-flex items-center gap-1">https://www.cloudflare.com/privacypolicy/ <ExternalLink className="w-3 h-3" /></a>
            </p>
            <p className="mb-3">
              Die Nutzung von Cloudflare erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen, sicheren und schnellen Darstellung unserer Website. Soweit personenbezogene Daten in die USA übermittelt werden, stützt sich die Übermittlung auf die Standardvertragsklauseln der EU-Kommission.
            </p>

            <h4 className="text-white mb-2 mt-3">Auftragsverarbeitung</h4>
            <p className="mb-3">
              Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-[#C2A878] mb-2 mt-4">Datenschutz</h3>
            <p className="mb-3">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-3">
              Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
            </p>
            <p className="mb-3">
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-3">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <div className="mb-3 bg-[#111111] p-4 rounded-lg border border-white/5">
              <p>Edit-Immobilien by Timo Konrad</p>
              <p>Timo Konrad</p>
              <p>Hoheluftchaussee 83</p>
              <p>20253 Hamburg</p>
              <p className="mt-2">Telefon: <a href="tel:01729037547" className="text-[#C2A878] hover:underline">01729037547</a></p>
              <p>E-Mail: <a href="mailto:kontakt@edit-immobilien.de" className="text-[#C2A878] hover:underline">kontakt@edit-immobilien.de</a></p>
            </div>
            <p className="mb-3">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Speicherdauer</h3>
            <p className="mb-3">
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="mb-3">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt. Ihren Widerruf können Sie per Mail an <a href="mailto:kontakt@edit-immobilien.de" className="text-[#C2A878] hover:underline">kontakt@edit-immobilien.de</a> richten.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>
            <div className="mb-3 bg-[#111111] p-4 rounded-lg border border-white/5 uppercase text-xs">
              <p className="mb-2">
                WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING.
              </p>
              <p className="mb-2">
                WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT.
              </p>
            </div>

            <h3 className="text-[#C2A878] mb-2 mt-4">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
            <p className="mb-3">
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">SSL- bzw. TLS-Verschlüsselung</h3>
            <p className="mb-3">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <p className="mb-3">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">4. Datenerfassung auf dieser Website</h2>
            
            <h3 className="text-[#C2A878] mb-2 mt-4">Cookies</h3>
            <p className="mb-3">
              Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.
            </p>
            <p className="mb-3">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Server-Log-Dateien</h3>
            <p className="mb-3">Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mb-3">Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>
            <p className="mb-3">
              Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden. Die Server-Log-Dateien werden maximal 90 Tage gespeichert.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Kontaktformular</h3>
            <p className="mb-3">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p className="mb-3">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.
            </p>

            <h3 className="text-[#C2A878] mb-2 mt-4">Anfrage per E-Mail, Telefon oder Telefax</h3>
            <p className="mb-3">
              Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">5. Datenbank- und Speicherdienst</h2>

            <h3 className="text-[#C2A878] mb-2 mt-4">Supabase</h3>
            <p className="mb-3">
              Zur Bereitstellung unserer Immobilienangebote (Objekttexte und -bilder) nutzen wir den Datenbank- und Speicherdienst Supabase. Anbieter ist die Supabase, Inc., USA. Beim Aufruf unserer Website lädt Ihr Browser die Immobiliendaten und -bilder direkt von den Servern von Supabase. Dabei wird Ihre IP-Adresse an Supabase übermittelt; dies ist technisch erforderlich, damit die Inhalte an Ihren Browser ausgeliefert werden können.
            </p>
            <p className="mb-3">
              Die Nutzung von Supabase erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer zuverlässigen Bereitstellung unserer Inhalte. Soweit personenbezogene Daten in ein Drittland (USA) übermittelt werden, stützt sich die Übermittlung auf die Standardvertragsklauseln der EU-Kommission. Weitere Informationen finden Sie in der Datenschutzerklärung von Supabase: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C2A878] hover:underline inline-flex items-center gap-1">https://supabase.com/privacy <ExternalLink className="w-3 h-3" /></a>
            </p>

            <h4 className="text-white mb-2 mt-3">Auftragsverarbeitung</h4>
            <p className="mb-3">
              Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl text-[#6B4F3A] mb-4">6. E-Mail-Versand</h2>

            <h3 className="text-[#C2A878] mb-2 mt-4">Resend</h3>
            <p className="mb-3">
              Für den Versand von E-Mails (z. B. aus dem Kontaktformular und bei Exposé-Anfragen) nutzen wir den Dienst Resend. Anbieter ist die Resend, Inc., USA. Die von Ihnen in den Formularen eingegebenen Daten werden zum Zweck der Zustellung Ihrer Anfrage an Resend übermittelt und dort verarbeitet.
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer effektiven Bearbeitung der an uns gerichteten Anfragen) bzw. Art. 6 Abs. 1 lit. a DSGVO, sofern eine Einwilligung abgefragt wurde. Soweit personenbezogene Daten in die USA übermittelt werden, stützt sich die Übermittlung auf die Standardvertragsklauseln der EU-Kommission. Weitere Informationen finden Sie in der Datenschutzerklärung von Resend: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#C2A878] hover:underline inline-flex items-center gap-1">https://resend.com/legal/privacy-policy <ExternalLink className="w-3 h-3" /></a>
            </p>

            <h4 className="text-white mb-2 mt-3">Auftragsverarbeitung</h4>
            <p className="mb-3">
              Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
            </p>
          </section>

          <section className="text-sm text-gray-400 pt-4 border-t border-white/10">
            <p>Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="hover:underline">e-recht24.de</a></p>
          </section>
    </div>
  );
}
