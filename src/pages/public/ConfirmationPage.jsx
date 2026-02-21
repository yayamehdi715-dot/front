import { Link } from 'react-router-dom'

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-sf-cream pt-20 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center animate-fade-up">
        <div className="w-24 h-24 bg-sf-rose-soft rounded-full flex items-center
                        justify-center mx-auto mb-8 text-5xl">
          🎉
        </div>

        <p className="sf-label mb-3">Commande confirmée</p>
        <h1 className="font-display text-sf-text text-6xl mb-4">Merci !</h1>
        <p className="font-body text-sf-text-soft leading-relaxed mb-2">
          Votre commande a bien été enregistrée.
        </p>
        <p className="font-body text-sf-text-soft leading-relaxed mb-8">
          Notre équipe vous contactera pour confirmer la livraison.
        </p>

        <div className="bg-sf-sage-soft rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🚚</span>
            <p className="font-body font-700 text-sf-text">Livraison estimée</p>
          </div>
          <p className="font-body text-sf-text-soft text-sm">2 à 5 jours ouvrables</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn-primary">
            Continuer mes achats 🛍️
          </Link>
          <Link to="/" className="btn-secondary">
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage