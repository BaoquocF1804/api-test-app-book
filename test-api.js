const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./novelly-786fb-firebase-adminsdk-fbsvc-201e9acd62.json'); // Đường dẫn tới file JSON bạn vừa tải

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = 3000;

// API: GET /books?category=Adventure
app.get('/books', async (req, res) => {
  const category = req.query.category || 'Adventure'; // Mặc định là Adventure
  try {
    const snapshot = await db.collection('books')
      .where('category', '==', category)
      .limit(25)
      .get();

    const books = [];
    snapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() });
    });

    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

// async function insertBook() {
//     const bookData = {
//       authorName: "Tô Hoài",
//       book: "https://8486efef5bc.vws.vegacdn.vn//Data/hcmedu/thcslethanhcong/de-men-phieu-luu-ky-to-hoai-thuviensachvn_232202392338.pdf",
//       category: "Adventure",
//       description: "Cuốn sách nổi tiếng về cuộc phiêu lưu của Dế Mèn.",
//       downloads: 0,
//       image: "https://muasachhay.vn/wp-content/uploads/2016/06/sach-de-men-phieu-luu-ky-mua-sach-hay.jpg",
//       searchTerms: ["de men", "dế mèn", "phiêu lưu", "to hoai"],
//       title: "Dế Mèn Phiêu Lưu Ký"
//     };
  
//     try {
//       const docRef = await db.collection('books').add(bookData);
//       console.log('Book inserted with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error inserting book:', error);
//     }
//   }
  
//   insertBook();

async function updateAllBooksBid() {
    const booksRef = db.collection('books');
    const snapshot = await booksRef.get();
  
    if (snapshot.empty) {
      console.log('No books found!');
      return;
    }
  
    let count = 0;
    for (const doc of snapshot.docs) {
      const docId = doc.id;
      await booksRef.doc(docId).update({ bid: docId });
      count++;
      console.log(`Updated book ${docId} with bid = ${docId}`);
    }
    console.log(`Done! Updated ${count} books.`);
  }
  
  updateAllBooksBid().catch(console.error);