import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProjectData } from 'src/app/models/dialog-data/project.data';
import { SectionData } from 'src/app/models/dialog-data/section-data';
import { Project } from 'src/app/models/project';
import { Section } from 'src/app/models/section';
import { ProjectService } from 'src/app/service/project.service';
import { SectionService } from 'src/app/service/section.service';
import { ConfirmBoxComponent } from '../dialogs/confirm-box/confirm-box.component';
import { ProjectInputBoxComponent } from '../dialogs/project-input-box/project-input-box.component';
import { SectionInputBoxComponent } from '../dialogs/section-input-box/section-input-box.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  sectionList!: Section[];
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private sectionService: SectionService,
    private router: Router
  ) {}

  /**
   * Use the routed parameter to get the project and sections
   * Not using async pipes but rather local variables so I can control when data is refreshed
   */

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.project = data.project;
      this.projectService
        .getSections(this.project.id)
        .subscribe((sections: Section[]) => {
          this.sectionList = sections;
        });
    });
  }

  /**
   * Opens Section-Input Dialog, if valid section returned create a new section
   */
  addSectionDialog() {
    let sectionDialog = this.dialog.open(SectionInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    sectionDialog.afterClosed().subscribe((section: SectionData) => {
      if (section.heading) {
        this.projectService
          .addSection(section, this.project.id)
          .subscribe((sections: Section[]) => {
            this.sectionList = sections;
          });
      }
    });
  }

  /**
   * Section ID's used by CDK Drag-Drop to connect lists to one another
   * @param slist The section which needs to be mapped
   */
  getSectionIDs(slist: Section[]): string[] {
    return slist.map((section: Section) => {
      return section.id + '';
    });
  }

  /**
   * Opens an edit dialog or a confirm delete dialog based on the icon pressed
   * @param event event has a type (edit/delete) and the section that is affected
   */
  changeSection(event: [string, Section]) {
    //On edit, reopen the dialog for input but put current value in data
    if (event[0] === 'edit') {
      let taskDialog = this.dialog.open(SectionInputBoxComponent, {
        width: '250px',
        data: { heading: event[1].heading, description: event[1].description },
      });

      taskDialog.afterClosed().subscribe((section: SectionData) => {
        if (section.heading) {
          this.sectionService
            .editSection(event[1].id, section)
            .subscribe(() => this.refreshSections());
        }
      });
    } else if (event[0] === 'delete') {
      this.sectionService
        .deleteSection(event[1].id)
        .subscribe(() => this.refreshSections());
    }
  }

  /**
   * Update the local list with new section orders,
   * If they dont match after the map, refresh local storage which reloads page
   */
  refreshSections() {
    this.projectService
      .getSections(this.project.id)
      .subscribe((sections: Section[]) => {
        sections.map((section: Section, i) => {
          if (this.sectionList[i] !== section) {
            this.sectionList[i].section_order = section.section_order;
          }
        });

        if (JSON.stringify(sections) !== JSON.stringify(this.sectionList)) {
          this.sectionList = sections;
        }
      });
  }

  /**
   * Open project-input dialog as an edit Dialog
   */
  editProject() {
    let taskDialog = this.dialog.open(ProjectInputBoxComponent, {
      width: '400px',
      data: {
        project_name: this.project.project_name,
        description: this.project.description,
        start_date: this.project.start_date,
        target_date: this.project.target_date,
      },
    });

    taskDialog.afterClosed().subscribe((project: ProjectData) => {
      if (project.project_name) {
        this.projectService
          .editProject(this.project.id, project)
          .subscribe(() => this.refreshProject());
      }
    });
  }

  /**
   * On delete, call delete from projectservice, then route to main page
   */

  deleteProject() {
    let confirmDialog = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: {
        heading: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService
          .deleteProject(this.project.id)
          .subscribe(() => this.router.navigate(['/main']));
      }
    });
  }

  /**
   * Refresh the project from the API
   */
  refreshProject() {
    this.projectService
      .getProject(this.project.id)
      .subscribe((project: Project) => (this.project = project));
  }

  /**
   * When a section is dropped, move its position
   * The followID depends on whether the section is moved left or right
   * moveItemInArray moves it locally, sectionService is used to move on API
   */
  dropSection(event: CdkDragDrop<any>) {
    let followID;
    if (event.previousIndex < event.currentIndex) {
      followID = event.container.data[event.currentIndex]
        ? event.container.data[event.currentIndex].id
        : 0;
    } else {
      followID = event.container.data[event.currentIndex - 1]
        ? event.container.data[event.currentIndex - 1].id
        : 0;
    }

    moveItemInArray(this.sectionList, event.previousIndex, event.currentIndex);
    this.sectionService
      .moveSection(event.container.data[event.currentIndex], followID)
      .subscribe(() => this.refreshSections());
  }
}
