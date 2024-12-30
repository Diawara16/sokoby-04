import React from 'react'

const AboutHeader = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center">Notre Histoire</h1>
      <div className="prose max-w-none mb-12 text-center">
        <p className="text-lg text-muted-foreground">
          Sokoby est née d'une vision simple : rendre le commerce en ligne accessible à tous.
          Notre plateforme combine innovation et simplicité pour permettre aux entrepreneurs
          de concrétiser leurs ambitions commerciales.
        </p>
      </div>
    </>
  )
}

export default AboutHeader