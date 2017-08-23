import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github/github.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [GithubService]
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private githubService: GithubService) { }

  public searchText;
  public searchResults;
  public searchCount;
  ngOnInit() {

  }
  onKeyup(event) {
    this.searchText = event.target.value;
  }

  getUsers() {
    this.githubService.getUser(this.searchText).subscribe(res => {
      this.searchResults = res;
      this.searchCount = res.total_count;
    });
  }

  showUserDetails(user) {
    this.router.navigate(['user', user.login]);
  }
}
