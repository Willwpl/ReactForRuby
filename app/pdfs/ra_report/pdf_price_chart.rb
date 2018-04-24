class PdfPriceChart
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def chart
    pdf = param[:pdf]
    user_company_name_hash = param[:user_company_name_hash]
    chart_color = param[:chart_color]
    uid = param[:uid]
    pdf.grid([2, 0], [11, 13]).bounding_box do
      # chart
      draw_chart
      # line
      chart_line
    end

    pdf.grid([2, 14], [11, 18]).bounding_box do
      pdf.move_down 5
      font_size = user_company_name_hash.keys().size > 20 ? 9 : 10
      pdf.fill_color "ffffff"
      uid.each {|user_id|
        pdf.font_size(font_size) {pdf.text user_company_name_hash[user_id], :color => chart_color[user_id], :valign => :center}
        pdf.move_down 12
      }
    end
  end

  def chart_line
    pdf = param[:pdf]
    chart_color = param[:chart_color]
    point_hash = draw_line
    #point polygon/ellipse
    pdf.stroke do
      point_hash.each_with_index do |(key, list), index|
        pdf.fill_color chart_color[key]
        list.each {|item|
          if item[:is_bidder]
            pdf.fill_polygon [item[:point_x], item[:point_y] + 4], [item[:point_x] + 4, item[:point_y] - 2], [item[:point_x] - 4, item[:point_y] - 2]
          else
            pdf.fill_ellipse [item[:point_x], item[:point_y]], 2.5
          end
        }
      end
    end
  end

  def draw_chart
    pdf = param[:pdf]
    base_x = param[:base_x]
    number_x = param[:number_x]
    number_y = param[:number_y]
    step_number = param[:step_number]
    pdf.move_down 10
    #stroke_axis
    pdf.stroke_color "ffffff"
    pdf.stroke do
      # X Y
      PdfUtils.draw_axis(param)

      (1..step_number).each do |i|
        pdf.horizontal_line number_x[0], number_x[0] + 5, :at => 20 + (200.0 / step_number) * i
        pdf.font_size(9) {pdf.text_box number_y[i], :at => [base_x - 60, 20 + (200 / step_number) * i + 3], :width => 55, :height => 10, :align => :right}
      end
      pdf.font_size(9) {pdf.text_box number_y[0], :at => [base_x - 60, 26], :width => 55, :height => 10, :align => :right}
    end
  end

  private

  def get_x(item)
    base_x = param[:base_x]
    start_time_i = param[:start_time_i]
    percentage_x = param[:percentage_x]
    offset_x = param[:offset_x]
    type_x = param[:type_x]
    if type_x == 0 then
      ((item.bid_time.to_i - start_time_i) * percentage_x).to_f + base_x + offset_x
    else
      data_x = (item.bid_time.to_i - start_time_i) / percentage_x
      data_x == 0 ? base_x : data_x + offset_x
    end
  end

  def draw_line
    hash = param[:hash]
    min_price = param[:min_price]
    percentage_y = param[:percentage_y]
    chart_color = param[:chart_color]
    pdf = param[:pdf]
    point_hash = {}
    hash.each_with_index do |(key, list), index|
      point_hash[key] = []
      pdf.stroke do
        pdf.line_width = 1.5
        pdf.stroke_color chart_color[key]
        list.each_with_index {|item, item_index|
          # x, y
          data_x = get_x(item)
          data_y = (item.average_price - min_price) / percentage_y + 20.0
          if item_index == 0
            pdf.move_to data_x, data_y
          else
            pdf.line_to data_x, data_y
          end
          point_hash[key].push({:point_x => data_x, :point_y => data_y, :is_bidder => item.flag == nil ? false : item.is_bidder})
        }
      end
    end
    point_hash
  end
end