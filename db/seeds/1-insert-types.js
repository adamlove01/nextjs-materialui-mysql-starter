exports.seed = function(knex) {
  // Delete ALL existing entries
  return knex('types')
    .del()
    .then(function() {
      // Insert seed entries
      return knex('types').insert([
        { id: 1, name: 'Noun' },
        { id: 2, name: 'Pronoun' },
        { id: 3, name: 'Adjective' },
        { id: 4, name: 'Verb' },
        { id: 5, name: 'Adverb' },
        { id: 6, name: 'Preposition' },
        { id: 7, name: 'Conjunction' },
        { id: 8, name: 'interjection' },
      ])
    })
}
