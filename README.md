# 🔗 LinkPlexity-AI
AI based extension to detect and block phishing or scam links in real time.

⚠️ *This extension is still under development.*



## ✨ Features
- Scan all links on any webpage
- Lightweight and fast (no external dependencies)
- Simple and user-friendly popup interface
- Works locally in the browser (privacy-friendly)



## 🛠️ Technical Overview
- **Manifest V3** Chrome Extension
- **Content Scripts** → Extract and analyze links from the page
- **Background Service Worker** → Handles lifecycle and events
- **Popup UI** → Built with HTML, CSS, and JavaScript
- Designed with modularity for future API & AI integration


## 🚀 Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/linkplexity-ai.git

2. Open Chrome and navigate to chrome://extensions/

3. Enable Developer mode (toggle in the top-right)

4. Click Load unpacked and select the project folder

5. The extension is now ready to use 🎉


## 📖 Usage

1. Open any webpage you want to check.  
2. Click on the **LinkPlexity AI** extension icon in your Chrome toolbar.  
3. In the popup, click **Scan Page Links**.  
4. The extension will show the number of links found and flag any that look suspicious.


## 🧭 Future Roadmap (Coming Soon 🚀)

- 🔗 **Threat Intelligence Integration**  
  - Connect with VirusTotal, Google Safe Browsing, and PhishTank APIs  

- 🎨 **Enhanced UI/UX**  
  - Color-coded risk levels, improved design, and animations  

- 🛡️ **Real-Time Protection**  
  - Highlight and block suspicious links directly on the webpage  

- 📊 **Analytics Dashboard**  
  - Show stats like number of links scanned and threats detected  

- 🌍 **Cross-Browser Support**  
  - Add support for Firefox and Microsoft Edge  

- 🤖 **AI-Based Detection**  
  - Detect domain spoofing (e.g., `paypa1.com` vs `paypal.com`)  
  - Check SSL certificates, domain age, and phishing patterns  

- 📱 **Mobile Expansion**  
  - Future SDKs for messaging apps and parental controls



---

## 🤝 Contributing
Contributions are welcome!  
- Open an **issue** for bugs or feature requests  
- Submit a **pull request** for improvements  

---

## 🙌 Acknowledgements
- Chrome Extensions (Manifest V3) Documentation  
- Security communities and open phishing datasets for inspiration  

---

🔒 **LinkPlexity AI — Making the web a safer place, one link at a time.**


