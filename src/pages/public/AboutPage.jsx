import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'

const ABOUT_TRANSLATIONS = {
  fr: {
    title: 'Notre Histoire',
    subtitle: 'Made by Marie',
    p1: 'est une boutique en ligne spécialisée dans la création de bouquets de fleurs',
    p1bold: 'faits main, de haute qualité',
    p1end: '— des compositions florales pensées pour durer toute une vie.',
    p2: "Depuis 2023, basés en Algérie, nous livrons dans toutes les wilayas. Chaque bouquet est assemblé à la main avec amour, emballé avec soin et livré directement chez vous en moins de 10 jours. Que ce soit pour un mariage, un anniversaire, ou simplement pour faire plaisir à quelqu'un que vous aimez — nous avons le bouquet parfait pour chaque occasion.",
    p3: 'Pour commander, il suffit de remplir le formulaire. Je vous envoie ensuite un message de confirmation.',
    confirmTitle: '💳 Confirmation de commande',
    confirmDesc: 'La confirmation se fait après versement de la moitié du prix :',
    valuesTitle: 'Nos valeurs',
    values: [
      { emoji: '💝', title: 'Fleurs de qualité', desc: "Des fleurs d'exception pour des êtres d'exception." },
      { emoji: '🚚', title: 'Livraison express', desc: "Livraison dans toute l'Algérie en moins de 10 jours." },
      { emoji: '🌸', title: 'Fait avec amour', desc: 'Chaque bouquet est composé à la main avec soin.' },
    ],
    cta: '🌺 Découvrir nos bouquets',
  },
  en: {
    title: 'Our Story',
    subtitle: 'Made by Marie',
    p1: 'is an online store specializing in handmade flower bouquets',
    p1bold: ' handmade, high quality',
    p1end: '— floral compositions designed to last a lifetime.',
    p2: 'Since 2023, based in Algeria, we deliver to all wilayas. Each bouquet is assembled by hand with love, carefully packaged and delivered directly to your door within 10 days. Whether for a wedding, a birthday, or simply to please someone you love — we have the perfect bouquet for every occasion.',
    p3: 'To order, simply fill in the form. We will then send you a confirmation message.',
    confirmTitle: '💳 Order Confirmation',
    confirmDesc: 'Confirmation is made after payment of half the price:',
    valuesTitle: 'Our values',
    values: [
      { emoji: '💝', title: 'Quality flowers', desc: 'Exceptional flowers for exceptional people.' },
      { emoji: '🚚', title: 'Express delivery', desc: 'Delivery across Algeria within 10 days.' },
      { emoji: '🌸', title: 'Made with love', desc: 'Every bouquet is carefully assembled by hand.' },
    ],
    cta: '🌺 Discover our bouquets',
  },
  ar: {
    title: 'قصتنا',
    subtitle: 'Made by Marie',
    p1: 'متجر إلكتروني متخصص في إنشاء باقات الزهور',
    p1bold: '100%  مصنوعة يدويًا، عالية الجودة',
    p1end: '— تركيبات زهرية مصممة لتدوم مدى الحياة.',
    p2: 'منذ عام 2023، نتخذ من الجزائر مقرًا لنا ونوصل إلى جميع الولايات. كل باقة تُجمَّع يدويًا بمحبة، تُعبأ بعناية وتُسلَّم مباشرة إلى بابك في أقل من 10 أيام. سواء كانت لحفل زفاف أو عيد ميلاد أو مجرد إسعاد شخص تحبه — لدينا الباقة المثالية لكل مناسبة.',
    p3: 'للطلب، ما عليك سوى ملء النموذج. سنرسل لك بعد ذلك رسالة تأكيد.',
    confirmTitle: '💳 تأكيد الطلب',
    confirmDesc: 'يتم التأكيد بعد دفع نصف السعر:',
    valuesTitle: 'قيمنا',
    values: [
      { emoji: '💝', title: 'زهور عالية الجودة', desc: 'زهور استثنائية لأشخاص استثنائيين.' },
      { emoji: '🚚', title: 'توصيل سريع', desc: 'توصيل في جميع أنحاء الجزائر في أقل من 10 أيام.' },
      { emoji: '🌸', title: 'مصنوع بحب', desc: 'كل باقة تُجمَّع بعناية يدويًا.' },
    ],
    cta: '🌺 اكتشف باقاتنا',
  },
}

export default function AboutPage() {
  const { lang } = useLang()
  const ab = ABOUT_TRANSLATIONS[lang] || ABOUT_TRANSLATIONS.fr

  return (
    <div className="min-h-screen bg-sky-soft font-display">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-text-dark text-2xl font-extrabold">{ab.title}</h1>
      </div>

      <section className="px-4 py-3">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="text-text-dark text-lg font-extrabold mb-4">{ab.subtitle}</h2>

          <p className="text-text-dark/70 text-sm leading-relaxed mb-4">
            <span className="text-pink-main font-bold">Made by Marie</span> {ab.p1}{' '}
            <span className="text-pink-main font-bold">{ab.p1bold}</span>{' '}
            {ab.p1end}
          </p>

          <p className="text-text-dark/70 text-sm leading-relaxed mb-4">{ab.p2}</p>

          <p className="text-text-dark/70 text-sm leading-relaxed mb-5">{ab.p3}</p>

          <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
            <p className="text-text-dark font-bold text-sm mb-1">{ab.confirmTitle}</p>
            <p className="text-text-dark/70 text-sm leading-relaxed">
              {ab.confirmDesc}{' '}
              <span className="font-bold text-pink-main">CCP / BARIDI / VISA CARD</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-4">
        <h2 className="text-text-dark text-xl font-extrabold mb-4">{ab.valuesTitle}</h2>
        <div className="flex flex-col gap-3">
          {ab.values.map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow-card p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center text-xl flex-shrink-0">
                {emoji}
              </div>
              <div>
                <p className="text-text-dark font-bold text-sm">{title}</p>
                <p className="text-text-dark/60 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-4 py-4 pb-8 text-center">
        <Link to="/products"
          className="inline-flex items-center justify-center gap-2 bg-pink-main text-white font-bold rounded-full px-8 py-3 text-sm shadow-md hover:bg-pink-main/90 transition-all active:scale-95">
          {ab.cta}
        </Link>
      </div>
    </div>
  )
}
