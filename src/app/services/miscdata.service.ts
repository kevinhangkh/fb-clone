import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiscdataService {

  static readonly avatars = [
    "../../assets/avatars/clint_eastwood.jpg",
    "../../assets/avatars/pulp_fiction.jpg",
    "../../assets/avatars/marty_mcfly.jpg",
    "../../assets/avatars/jack_sparrow.jpg",
    "../../assets/avatars/leonardo.jpg",
    "../../assets/avatars/walter_white.jpg",
    "../../assets/avatars/fight_club.png",
    "../../assets/avatars/scream.jpg",
    "../../assets/avatars/freddy_krueger.jpg",
    "../../assets/avatars/baywatch.jpg",
    "../../assets/avatars/superman.jpg",
    "../../assets/avatars/beast.jpg",
    "../../assets/avatars/lara_croft.jpg",
    "../../assets/avatars/bruce_lee.jpg",
];

static readonly maxMutualFriends = 9;

static readonly schools = [
    "Greendale Community College",
    "Los Pollos Hermanos",
    "Central Perk",
    "Lexington Event Center",
    "Hill Valley",
    "Hogwarts",
    "King's Landing",
    "Rapture",
    "Coruscant",
    "Yavin IV",
    "Mos Eisley",
    "Naboo",
    "Geonosis",
    "Los Santos",
    "New New York",
    "Bikini Bottom",
    "Mordor",
    "Valhalla",
    "Springfield",
    "Easy Street",
    "Currahee",
    "Area 51",
    "Cayo Perico",
    "Vespucci Beach",
    "Fort Zancudo"
];

static readonly stories: Story[] = [
    {url: "../../../assets/stories/charlie_robert.jpg", name:"Charlie Rock"},
    {url: "../../../assets/stories/christina_ferrer.jpg", name:"Christina Ferrer"},
    {url: "../../../assets/stories/sudan_nakarmi.jpg", name:"Sudan Nakarmi"},
    {url: "../../../assets/stories/smith_major.jpg", name:"Smith Major"},
    {url: "../../../assets/stories/dean_amir_hussain.jpg", name:"Dean Amir Hussain"},
    {url: "../../../assets/stories/chrizanne_babatunde.jpg", name:"Chrizanne Babatunde"},
    {url: "../../../assets/stories/roman_kerry.jpg", name:"Roman Kerry"},
    // {url: "../../../assets/stories/walter_white.jpg", name:"Heisenberg"},
    {url: "../../../assets/stories/anastase_maragos.jpg", name:"Anastase Maragos"},
    {url: "../../../assets/stories/courtney_shepard.jpg", name:"Courtney Shepard"},
    {url: "../../../assets/stories/darcy_hanley.jpg", name:"Darcy Hanley"},
    {url: "../../../assets/stories/josh_duke.jpg", name:"Josh Duke"},
    {url: "../../../assets/stories/joye_ash.jpg", name:"Joye Ash"},
    {url: "../../../assets/stories/julia_tingey.jpg", name:"Julia Tingey"},
    {url: "../../../assets/stories/kennard_paxton.jpg", name:"Kennard Paxton"},
    {url: "../../../assets/stories/laura_adai.jpg", name:"Laura Adai"},
    {url: "../../../assets/stories/lindsey_greene.jpg", name:"Lindsey Greene"},
    {url: "../../../assets/stories/michelle_stamp.jpg", name:"Michelle Stamp"},
    {url: "../../../assets/stories/paul_white.jpg", name:"Paul White"},
    {url: "../../../assets/stories/roman_shilin.jpg", name:"Roman Shilin"},
    {url: "../../../assets/stories/sebastian_mark.jpg", name:"Sebastian Mark"},
    {url: "../../../assets/stories/diego_gerald.jpg", name:"Diego Gerald"},
    {url: "../../../assets/stories/stephan_valentin.jpg", name:"Stephan Valentin"},
    {url: "../../../assets/stories/ravi_sharma.jpg", name:"Ravi Sharma"},
    {url: "../../../assets/stories/deshawn_wilson.jpg", name:"Deshawn Wilson"},
    {url: "../../../assets/stories/stevie_halama.jpg", name:"Stevie Halama"},
    {url: "../../../assets/stories/taylor_smith.jpg", name:"Taylor Smith"},
    {url: "../../../assets/stories/ernesto_haagrah.jpg", name:"Ernesto Haagrah"},
    {url: "../../../assets/stories/ernesto_haagrah2.jpg", name:"Ernesto Haagrah"},
    {url: "../../../assets/stories/ernesto_haagrah3.jpg", name:"Ernesto Haagrah"},
    {url: "../../../assets/stories/ernesto_haagrah4.jpg", name:"Ernesto Haagrah"},
    {url: "../../../assets/stories/arielle_boulinprat.JPG", name:"Arielle Boulin-Prat"},
    {url: "../../../assets/stories/arielle_boulinprat.JPG", name:"Arielle Boulin-Prat"},
    {url: "../../../assets/stories/laurent_romejko.JPG", name:"Laurent Romejko"},
    {url: "../../../assets/stories/bertrand_renard.JPG", name:"Bertrand Renard"},
];

  constructor() { }

  getRandomStories(count: number): Observable<Story[]> {
    // return new Observable((observer) => {


      let stories: Story[] = [];

      while (stories.length < count) {
        let story = MiscdataService.stories[Math.floor(Math.random() * MiscdataService.stories.length)];
        if (stories.indexOf(story) === -1) {
          stories.push(story);
        }
      }

      return of(stories);

    //   observer.next(stories);
    // });
  }

}

export class Story {
  url: string;
  name: string;
}
