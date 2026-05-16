import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [RouterLink, MatToolbar, MatToolbarRow, MatIconButton, MatIcon],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export default class List {}
