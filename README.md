# დAIცავი(dAIcavi)
An AI-powered parental control system that runs on your device, ensuring children's safety and privacy with help of our mascot: Aurora!.
Developed by [Barbare Gogadze](https://github.com/barbarehh), [Tamar Kobaladze](https://github.com/kobaladzet) and Me, Saba Guledani.

---

## Introduction

Daicavi aims to address the critical issue of children's cyber security. Every day, minors face numerous threats online and through private messages, including phishing, pornographic, gambling, and other dangerous links and websites, as well as violent and inappropriate images. Current parental control solutions often rely on internet access and databases, raising concerns about privacy and effectiveness. Daicavi offers a robust, offline, AI-powered solution to keep children safe while preserving their privacy.

## Key Features

- **AI-Powered Protection**: Utilizes MobileNet for image classification, Transformer model for website content classification, and URLNet for URL classification to block inappropriate content.
- **Offline Processing**: Operates on-device with minimal or no internet access, ensuring children's confidential information remains secure.
- **Educational Mascot - Aurora**: Our mascot, Aurora, helps children understand why certain content is blocked, raising self-awareness and protecting their mental health.
- **Comprehensive Coverage**: Blocks pornographic, violent, gambling, and other dangerous content across websites and private messages.

## Components

### Parental Application
- Allows parents to monitor and control their children's online activities.
- Provides reports and alerts about attempted access to dangerous content.

### Child's Extension
- Prevents access to inappropriate information.
- Uses the Aurora mascot to educate children about cyber threats and the importance of safe online behavior.

## Technical Details

- **Image Classification**: Uses MobileNet to classify and assess the threat level of images, blocking inappropriate content.
- **Website Classification**: Utilizes the Transformer model to evaluate and identify dangerous websites based on their content.
- **URL Classification**: Implements URLNet to classify URLs into categories such as adult, malicious, and safe, blocking harmful sites without needing external databases.
- **Local Processing**: All links and images are evaluated by local AI models, and blocked URLs and images are stored in a local JSON file to avoid redundant checks.

## Future Plans

- **Aurora's AI**: Incorporate a pre-trained transformer for Aurora to provide detailed cybersecurity education to children.
- **Enhanced Website Classification**: Add a transformer model for more sophisticated website classification based on HTML content.

## Privacy and Security

- **Offline Processing**: Ensures that all data processing occurs on the device, significantly reducing the risk of data breaches and complying with GDPR regulations.
- **Local Storage**: Stores blocked URLs and images locally, preventing repeated evaluations and maintaining privacy.

## Installation and Usage
Once finished tutorial will be written on how to install and use this program.

## Contributing

We welcome contributions to enhance Daicavi. Please fork the repository and create a pull request with your changes. Ensure that your contributions adhere to our coding guidelines and standards.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please reach out to us at [email](saba.guledani.1@btu.edu.ge).
