class PdfAggregateConsumption
  attr_reader :param

  def initialize(param)
    @param = param
  end

  def aggregate
    pdf, auction_contract = param[:pdf], param[:auction_contract]
    pdf.table [["Aggregate Consumption: #{auction_contract.contract_duration} Months"]], :cell_style => {:size => 18, :inline_format => true, :width => pdf.bounds.right, :border_width => 0}
    head_row, peak_row, off_peak_row = [''], ['Peak<br/>(7am-7pm)'], ['Off-Peak<br/>(7pm-7am)']
    push_colume_data({:head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'LT', :peak => auction_contract.total_lt_peak, :off_peak => auction_contract.total_lt_off_peak})
    push_colume_data({:head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'HT(Small)', :peak => auction_contract.total_hts_peak, :off_peak => auction_contract.total_hts_off_peak})

    push_colume_data({:head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'HT(Large)', :peak => auction_contract.total_htl_peak, :off_peak => auction_contract.total_htl_off_peak})
    push_colume_data({:head_row => head_row, :peak_row => peak_row, :off_peak_row => off_peak_row, :title => 'EHT', :peak => auction_contract.total_eht_peak, :off_peak => auction_contract.total_eht_off_peak})


    pdf.table([head_row, peak_row, off_peak_row], :header => true, :cell_style => {:width => pdf.bounds.right / head_row.size, :size => 9, :align => :center, :valign => :center, :padding => [8, 2, 14], :inline_format => true, :border_width => 0.01, :border_color => "424242"}) do
      values = cells.columns(0..-1).rows(0..0)
      values.background_color = "00394A"
    end
  end

  def push_colume_data(param)
    title, peak, off_peak = param[:title], param[:peak], param[:off_peak]
    head_row, peak_row, off_peak_row = param[:head_row], param[:peak_row], param[:off_peak_row]
    is_zero = false
    is_zero = true if (peak == 0 || peak.blank?) && (off_peak == 0 || off_peak.blank?)
    unless is_zero
      head_row.push(title)
      peak_row.push(PdfUtils.number_format(peak))
      off_peak_row.push(PdfUtils.number_format(off_peak))
    end
  end
end