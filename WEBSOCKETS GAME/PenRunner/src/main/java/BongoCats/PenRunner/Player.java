package BongoCats.PenRunner;

public class Player {

	private long id;
	private int x, y;
	private int score;
	private int angle;
	private String color;
	private boolean arrived;
	
	Player() {
		this.score = 0;
		this.arrived = false;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getX() {
		return x;
	}
	
	public boolean getArrived()
	{
		return arrived;
	}
	
	public void setArrived(boolean x)
	{
		this.arrived = x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public int getAngle() {
		return angle;
	}

	public void setAngle(int angle) {
		this.angle = angle;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Override
	public String toString() {
		return "[" + "\"id\":" + id + ",  \"x\":" + x + ", \"y\":" + y + ", \"angle\":"+ angle+ ", \"score\":" + score + "]";
	}
	
}
