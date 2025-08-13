// display class handles rendering content to terminal
// todo implement fancy formatting and styling
export class Display {
  constructor() {
    // basic display setup
  }

  // renders content to the terminal
  async render(content: string): Promise<void> {
    // todo add colors and formatting
    console.log(content);
  }
}

export default Display;