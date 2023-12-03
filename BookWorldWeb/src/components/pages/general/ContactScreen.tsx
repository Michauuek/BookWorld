import "./contact.css"

const ContactScreen = () => {
    return (
        <div className="contact-container">
            <div className="contact-info">
                <p>BookWorld</p>
                <p>tel: +48-123-456-789</p>
                <p>
                    <a href="mailto:test">bookworld@example.company</a>
                </p>
                <p>NIP: 123-456-78-90</p>
                <p>REGON: 123456789</p>
                <p>ul. Warszawska 24, 31-155 Kraków</p>
            </div>
            <div className={"map-container"}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.815866440897!2d19.940503176535014!3d50.07100997152221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b04a1f6a23f%3A0xea28a4cede108adf!2sWydzia%C5%82%20In%C5%BCynierii%20Elektrycznej%20i%20Komputerowej%20Politechniki%20Krakowskiej!5e0!3m2!1spl!2spl!4v1701559411249!5m2!1spl!2spl" width="600" height="450"
    style={{border: 0}} allowFullScreen="" loading="lazy"/>
            </div>
        </div>
    )
}

export { ContactScreen }