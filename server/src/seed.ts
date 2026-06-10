import { get, all, run, initializeDatabase } from './database.js';
import bcrypt from 'bcryptjs';

async function main() {
  await initializeDatabase();

  // Clear existing data
  await run('DELETE FROM patient_documents');
  await run('DELETE FROM patient_messages');
  await run('DELETE FROM faq_items');
  await run('DELETE FROM faq_categories');
  await run('DELETE FROM blog_posts');
  await run('DELETE FROM appointments');
  await run('DELETE FROM contact_messages');
  await run('DELETE FROM patients');
  await run('DELETE FROM settings');
  await run('DELETE FROM admin_users');

  // Reset sequences
  await run("ALTER SEQUENCE patients_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE appointments_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE blog_posts_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE contact_messages_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE faq_categories_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE faq_items_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE settings_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE admin_users_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE patient_messages_id_seq RESTART WITH 1");
  await run("ALTER SEQUENCE patient_documents_id_seq RESTART WITH 1");

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12);
  await run('INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)', 'admin', adminHash, 'Dr. Amine Benali');

  // Patients
  const patientHash = await bcrypt.hash('password123', 12);
  const patientIds: number[] = [];
  const patients = [
    { fn: 'Marie', ln: 'Dupont', email: 'marie.dupont@email.com', phone: '0612345678' },
    { fn: 'Pierre', ln: 'Lambert', email: 'pierre.lambert@email.com', phone: '0623456789' },
    { fn: 'Sophie', ln: 'Martin', email: 'sophie.martin@email.com', phone: '0634567890' },
    { fn: 'Jean', ln: 'Durand', email: 'jean.durand@email.com', phone: '0645678901' },
    { fn: 'Claire', ln: 'Moreau', email: 'claire.moreau@email.com', phone: '0656789012' },
  ];
  for (const p of patients) {
    const result = await run(
      'INSERT INTO patients (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?) RETURNING id',
      p.fn, p.ln, p.email, p.phone, patientHash
    );
    patientIds.push(result.rows[0].id);
  }

  // Appointments
  const apts = [
    { pi: patientIds[0], fn: 'Marie', ln: 'Dupont', ph: '0612345678', em: 'marie.dupont@email.com', dt: '2024-01-20', ts: '10:00', mf: 'Consultation générale', ns: '', st: 'confirmed' },
    { pi: patientIds[0], fn: 'Marie', ln: 'Dupont', ph: '0612345678', em: 'marie.dupont@email.com', dt: '2024-01-27', ts: '14:30', mf: 'Suivi médical', ns: '', st: 'pending' },
    { pi: patientIds[0], fn: 'Marie', ln: 'Dupont', ph: '0612345678', em: 'marie.dupont@email.com', dt: '2024-01-10', ts: '09:00', mf: 'Consultation générale', ns: 'Prescription: Doliprane 1000mg', st: 'completed' },
    { pi: patientIds[0], fn: 'Marie', ln: 'Dupont', ph: '0612345678', em: 'marie.dupont@email.com', dt: '2023-12-28', ts: '11:00', mf: 'Contrôle de santé', ns: 'Bilan sanguin normal', st: 'completed' },
    { pi: patientIds[1], fn: 'Pierre', ln: 'Lambert', ph: '0623456789', em: 'pierre.lambert@email.com', dt: '2024-01-20', ts: '10:00', mf: 'Suivi médical', ns: '', st: 'in-progress' },
    { pi: patientIds[2], fn: 'Sophie', ln: 'Martin', ph: '0634567890', em: 'sophie.martin@email.com', dt: '2024-01-20', ts: '11:00', mf: 'Vaccination', ns: '', st: 'pending' },
    { pi: patientIds[3], fn: 'Jean', ln: 'Durand', ph: '0645678901', em: 'jean.durand@email.com', dt: '2024-01-20', ts: '14:00', mf: 'Contrôle de santé', ns: '', st: 'pending' },
    { pi: patientIds[4], fn: 'Claire', ln: 'Moreau', ph: '0656789012', em: 'claire.moreau@email.com', dt: '2024-01-20', ts: '15:00', mf: 'Suivi médical', ns: '', st: 'pending' },
  ];
  for (const a of apts) {
    await run(
      'INSERT INTO appointments (patient_id, first_name, last_name, phone, email, date, time_slot, motif, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      a.pi, a.fn, a.ln, a.ph, a.em, a.dt, a.ts, a.mf, a.ns, a.st
    );
  }

  // Blog posts
  const blogs = [
    { title: '10 conseils pour booster votre système immunitaire', slug: '10-conseils-booster-systeme-immunitaire', excerpt: 'Découvrez les meilleures stratégies naturelles pour renforcer vos défenses immunitaires et rester en bonne santé toute l\'année.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'prevention', image_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop', published: true, featured: true, views: 1234 },
    { title: 'L\'importance d\'une alimentation équilibrée', slug: 'importance-alimentation-equilibree', excerpt: 'Une alimentation saine est la base d\'une bonne santé. Apprenez à composer des repas nutritifs et équilibrés.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', category: 'nutrition', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', published: true, featured: false, views: 856 },
    { title: 'Comprendre et gérer le stress au quotidien', slug: 'comprendre-gerer-stress-quotidien', excerpt: 'Le stress affecte notre santé de nombreuses façons. Découvrez des techniques efficaces pour mieux le gérer.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', category: 'wellness', image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=400&fit=crop', published: true, featured: true, views: 742 },
    { title: 'Les bienfaits de l\'activité physique régulière', slug: 'bienfaits-activite-physique-reguliere', excerpt: 'L\'exercice physique est essentiel pour maintenir une bonne santé. Découvrez ses nombreux bienfaits.', content: 'Lorem ipsum dolor sit amet.', category: 'advice', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', published: true, featured: false, views: 523 },
    { title: 'Vaccination : tout ce que vous devez savoir', slug: 'vaccination-tout-ce-que-vous-devez-savoir', excerpt: 'La vaccination est l\'un des moyens les plus efficaces de prévenir les maladies infectieuses.', content: 'Lorem ipsum dolor sit amet.', category: 'prevention', image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop', published: true, featured: false, views: 892 },
    { title: 'Nouvelles recommandations pour le dépistage du cancer', slug: 'nouvelles-recommandations-depistage-cancer', excerpt: 'Les autorités de santé ont mis à jour les recommandations concernant les dépistages. Faites le point.', content: 'Lorem ipsum dolor sit amet.', category: 'news', image_url: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop', published: true, featured: false, views: 654 },
    { title: 'Sommeil : comment améliorer la qualité de vos nuits', slug: 'sommeil-ameliorer-qualite-nuits', excerpt: 'Un bon sommeil est essentiel pour votre santé. Découvrez nos conseils pour mieux dormir.', content: 'Lorem ipsum dolor sit amet.', category: 'wellness', image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop', published: true, featured: false, views: 431 },
    { title: 'Les superaliments : mythe ou réalité ?', slug: 'superaliments-mythe-realite', excerpt: 'On entend beaucoup parler de superaliments. Mais que valent-ils vraiment ? Faisons le point.', content: 'Lorem ipsum dolor sit amet.', category: 'nutrition', image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop', published: false, featured: false, views: 312 },
  ];
  for (const b of blogs) {
    await run(
      'INSERT INTO blog_posts (title, slug, excerpt, content, category, image_url, author, published, featured, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      b.title, b.slug, b.excerpt, b.content, b.category, b.image_url, 'Dr. Amine Benali', b.published, b.featured, b.views
    );
  }

  // FAQ categories
  const fc1 = await run("INSERT INTO faq_categories (name, icon, sort_order) VALUES ('Rendez-vous', 'Calendar', 1) RETURNING id");
  const fc2 = await run("INSERT INTO faq_categories (name, icon, sort_order) VALUES ('Pratique', 'Clock', 2) RETURNING id");
  const fc3 = await run("INSERT INTO faq_categories (name, icon, sort_order) VALUES ('Paiement', 'CreditCard', 3) RETURNING id");

  // FAQ items
  const faqs = [
    { ci: fc1.rows[0].id, q: 'Comment prendre rendez-vous ?', a: 'Vous pouvez prendre rendez-vous de plusieurs façons : en ligne via notre formulaire de prise de rendez-vous, par téléphone au +213 21 23 45 67, ou directement au cabinet.', so: 1 },
    { ci: fc1.rows[0].id, q: 'Quels sont les délais pour obtenir un rendez-vous ?', a: 'Nous nous efforçons de vous proposer un rendez-vous dans les meilleurs délais. En général, un rendez-vous est disponible sous 24 à 48 heures pour les consultations non urgentes.', so: 2 },
    { ci: fc1.rows[0].id, q: 'Puis-je modifier ou annuler mon rendez-vous ?', a: "Oui, vous pouvez modifier ou annuler votre rendez-vous jusqu'à 24 heures avant l'heure prévue sans frais.", so: 3 },
    { ci: fc1.rows[0].id, q: 'Dois-je arriver en avance pour mon rendez-vous ?', a: 'Oui, nous vous recommandons d\'arriver 10 à 15 minutes avant votre rendez-vous pour compléter les formalités administratives si nécessaire.', so: 4 },
    { ci: fc2.rows[0].id, q: "Quels sont les horaires d'ouverture du cabinet ?", a: 'Le cabinet est ouvert du dimanche au jeudi de 8h00 à 18h00, et le samedi de 9h00 à 12h00. Nous sommes fermés le vendredi et les jours fériés.', so: 1 },
    { ci: fc2.rows[0].id, q: 'Quels documents dois-je apporter pour ma consultation ?', a: "Pensez à apporter votre carte Chifa, votre carte de complémentaire santé, une pièce d'identité, et tous les documents médicaux pertinents.", so: 2 },
    { ci: fc2.rows[0].id, q: 'Comment accéder au cabinet ?', a: 'Le cabinet est situé au 24 Rue Didouche Mourad, 16000 Alger. Il est accessible en métro, tramway, bus et taxi.', so: 3 },
    { ci: fc2.rows[0].id, q: 'Y a-t-il un parking à proximité ?', a: 'Oui, un parking public se trouve à 2 minutes à pied du cabinet. Il est payant.', so: 4 },
    { ci: fc3.rows[0].id, q: 'Quels moyens de paiement sont acceptés ?', a: 'Nous acceptons les paiements par carte bancaire, chèque, espèces et virement. Le paiement sans contact est disponible.', so: 1 },
    { ci: fc3.rows[0].id, q: 'Acceptez-vous la carte Chifa et les complémentaires santé ?', a: 'Oui, nous acceptons la carte Chifa et les cartes de complémentaire santé pour le tiers payant.', so: 2 },
    { ci: fc3.rows[0].id, q: 'Quels sont les tarifs des consultations ?', a: 'Les tarifs varient selon le type de consultation : 2 500 DA pour une consultation générale, 3 000 DA pour un suivi, 5 000 DA pour un bilan de santé complet.', so: 3 },
    { ci: fc3.rows[0].id, q: 'Proposez-vous des facilités de paiement ?', a: 'Pour les patients en difficulté financière, nous pouvons étudier des solutions de paiement adaptées.', so: 4 },
  ];
  for (const f of faqs) {
    await run('INSERT INTO faq_items (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?)', f.ci, f.q, f.a, f.so);
  }

  // Contact messages
  await run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    'Test User', 'test@email.com', '0612345678', 'information', 'Bonjour, je souhaiterais avoir plus d\'informations sur vos services.');

  // Patient messages
  const pm1 = await run(
    'INSERT INTO patient_messages (patient_id, subject, message, reply, reply_at, read_by_admin, read_by_patient) VALUES (?, ?, ?, ?, NOW(), TRUE, TRUE) RETURNING id',
    patientIds[0], 'Question sur mon traitement', 'Bonjour docteur, j\'ai une question concernant mon traitement. Est-ce que je peux prendre du Doliprane avec mon médicament actuel ?',
    'Bonjour Marie, il n\'y a pas de contre-indication connue. Vous pouvez prendre du Doliprane 1000mg si nécessaire, sans dépasser 3 comprimés par jour.'
  );
  await run(
    'INSERT INTO patient_messages (patient_id, subject, message) VALUES (?, ?, ?)',
    patientIds[0], 'Résultats d\'analyse', 'Bonjour, j\'ai reçu mes résultats d\'analyse. Pouvez-vous me dire si tout va bien ?'
  );
  await run(
    'INSERT INTO patient_messages (patient_id, subject, message, reply, reply_at, read_by_admin, read_by_patient) VALUES (?, ?, ?, ?, NOW(), TRUE, TRUE) RETURNING id',
    patientIds[1], 'Demande de renouvellement', 'Bonjour Dr. Benali, pourriez-vous renouveler mon ordonnance ? Merci.',
    'Bonjour Pierre, votre ordonnance a été renouvelée. Vous pouvez passer au cabinet pour la récupérer.'
  );

  // Patient documents
  const fakePdf = 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNjUgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjIzNgolJUVPRA==';
  await run('INSERT INTO patient_documents (patient_id, name, file_type, file_data, file_size) VALUES (?, ?, ?, ?, ?)',
    patientIds[0], 'Ordonnance.pdf', 'application/pdf', fakePdf, 342);
  await run('INSERT INTO patient_documents (patient_id, name, file_type, file_data, file_size) VALUES (?, ?, ?, ?, ?)',
    patientIds[0], 'Résultats analyse sang.pdf', 'application/pdf', fakePdf, 342);

  // Settings
  const settings = [
    { k: 'cabinet_name', v: 'Cabinet Dr. Benali' },
    { k: 'cabinet_email', v: 'contact@dr-benali.dz' },
    { k: 'cabinet_phone', v: '+213 21 23 45 67' },
    { k: 'cabinet_address', v: '24 Rue Didouche Mourad, 16000 Alger' },
  ];
  for (const s of settings) {
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', s.k, s.v);
  }

  console.log('Database seeded successfully!');
  console.log('Admin login: admin / admin123');
  console.log('Patient login: marie.dupont@email.com / password123');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
