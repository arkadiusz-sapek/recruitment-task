import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from'./home.service';
import { GlobalService } from '../../core/services/global.service';
import {} from './../../core/components/my-paginator/my-paginator.component'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() public myEmitter = new EventEmitter();
  public movies;
  public searchedPhrase='';
  public searchSucces;
  public numberOfElements;
  public actualPage;
  private paginatorReset: EventEmitter<any> = new EventEmitter();
  constructor(
    private homeService: HomeService,
    private globalService: GlobalService,
  ){}

  ngOnInit() {
    this.searchedPhrase=this.globalService.getLastSearchedPhrase();
    this.searchMovies(this.globalService.getLastSearchedPhrase(),1);

    this.globalService.events$.forEach(searchedPhrase =>{
        this.globalService.setLastSearchedPhrase(searchedPhrase);
        this.searchedPhrase=searchedPhrase
        this.searchMovies(searchedPhrase,1);
        this.paginatorReset.next();
    })
  }
  
  searchMovies(searchedPhrase, pageNumber){
    this.homeService.getMovies(searchedPhrase, pageNumber).subscribe(res=>{
      if(res!=='error'){
        this.searchedPhrase=searchedPhrase;
        this.movies=res.movies;
        this.numberOfElements=res.numberOfResults;
        this.searchSucces=true;
        
      }else{
        this.movies=[];
        this.searchSucces=false;
        this.paginatorReset.next();
      }    
    })
  }

  addMovieToFavourite(movie){
    this.homeService.addMovieToFavourites(movie._id).subscribe();
    movie.isFavourite=true;
  }

  removeMovieFromFavourites(movie){
    this.globalService.removeMovieFromFavourites(movie._id);
    movie.isFavourite=false;
  }

  paginationReload(pageNumber){
    this.searchMovies(this.searchedPhrase, pageNumber);
  }
}
